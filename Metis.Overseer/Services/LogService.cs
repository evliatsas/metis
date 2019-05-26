using Metis.Core.Entities;
using Metis.Teamwork.Entities;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metis.Overseer.Services
{
    public class LogService
    {
        private readonly IMongoCollection<LogBook> _LogBooks;
        private readonly IMongoCollection<LogEntry> _LogEntries;
        private readonly IMongoCollection<ChatMessage> _ChatMessages;
        private readonly IMongoCollection<User> _Users;

        public LogService(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("metis");
            _LogBooks = database.GetCollection<LogBook>("logBooks");
            _LogEntries = database.GetCollection<LogEntry>("logEntries");
            _ChatMessages = database.GetCollection<ChatMessage>("chats");
            _Users = database.GetCollection<User>("users");
        }

        public async Task<IEnumerable<LogBook>> GetBooks(string userId)
        {
            FilterDefinition<LogBook> filter = "{$or:[{'owner.userId':'" + userId + "'},{members:{$elemMatch:{userId:'" + userId + "'}}}]}";
            var result = await _LogBooks
                .Find(filter)
                .Project<LogBook>(Builders<LogBook>.Projection
                    .Include(x => x.Id)
                    .Include(x => x.Close)
                    .Include(x => x.Members)
                    .Include(x => x.Owner)
                    .Include(x => x.Name))
                .SortByDescending(x => x.Close)
                .ToListAsync();

            var pipeline = new BsonDocument[] {
                new BsonDocument{{"$group", new BsonDocument{
                            {"_id", "logBookId"},
                            {"count",new BsonDocument{
                                    {"$sum",1}}
                            }}
                    }}
            };
            var counts = await _LogEntries.Aggregate<BsonDocument>(pipeline).ToListAsync();

            foreach (var b in result)
            {
                var v = counts.FirstOrDefault(t => t.GetValue("_id") == b.Id);
                if (v != null)
                {
                    b.EntriesCount = (Int64)v.GetValue("count");
                }
                b.MembersCount = b.Members.Count();
            }

            return result;
        }

        public async Task<LogBook> GetBook(string id)
        {
            var book = await _LogBooks
                .Find(x => x.Id == id)
                .SingleOrDefaultAsync();

            if (book == null)
            {
                throw new KeyNotFoundException($"The Log book {id} does not exist.");
            }

            var entries = await _LogEntries
                .Find(x => x.LogBookId == id)
                .SortBy(x => x.Status)
                .ThenByDescending(x => x.Priority)
                .ThenByDescending(x => x.DTG)
                .ToListAsync();

            var entriesCount = await _LogEntries
                .Find(x => x.LogBookId == id)
                .CountDocumentsAsync();

            book.EntriesCount = entriesCount;
            book.Entries = entries;
            book.MembersCount = book.Members.Count();

            return book;
        }

        public async Task<LogEntry> GetEntry(string id)
        {
            var entry = await _LogEntries
                .Find(x => x.Id == id)
                .SingleOrDefaultAsync();

            if (entry == null)
            {
                throw new KeyNotFoundException($"The Log entry {id} does not exist.");
            }

            return entry;
        }

        public async Task<LogBook> Create(LogBook book)
        {
            await _LogBooks.InsertOneAsync(book);
            return book;
        }

        public async Task<LogEntry> Create(LogEntry entry)
        {
            if (string.IsNullOrEmpty(entry.LogBookId))
            {
                throw new NullReferenceException("The Log entry must belong to an existing book");
            }
            var bookExists = await _LogBooks.CountDocumentsAsync(x => x.Id == entry.LogBookId);
            if (bookExists < 1)
            {
                throw new NullReferenceException("The Log entry book does not exist");
            }

            await _LogEntries.InsertOneAsync(entry);
            return entry;
        }

        public async Task Update(string id, LogBook book)
        {
            await _LogBooks.ReplaceOneAsync(x => x.Id == id, book);
        }

        public async Task Update(string id, LogEntry entry)
        {
            await _LogEntries.ReplaceOneAsync(x => x.Id == id, entry);
        }

        public async Task RemoveBook(string id)
        {
            await _LogBooks.DeleteOneAsync(x => x.Id == id);
        }

        public async Task RemoveEntry(string id)
        {
            await _LogEntries.DeleteOneAsync(x => x.Id == id);
        }

        public async Task<ChatMessage> CreateMessage(string userId, string logBookId, string message)
        {
            var book = await _LogBooks
                .Find(x => x.Id == logBookId)
                .SingleOrDefaultAsync();

            if (book == null)
            {
                throw new KeyNotFoundException($"The Log book {logBookId} does not exist.");
            }

            var user = await _Users
                .Find(x => x.Id == userId)
                .SingleOrDefaultAsync();

            if (user == null)
            {
                throw new KeyNotFoundException($"The User {userId} does not exist.");
            }

            var entry = new ChatMessage();
            entry.LogBookId = logBookId;
            entry.Message = message;
            entry.Sent = DateTime.Now;
            entry.Sender = new User
            {
                Id = user.Id,
                Username = user.Username,
                Title = user.Title,
                Email = user.Email
            };
            await _ChatMessages.InsertOneAsync(entry);
            return entry;
        }

        public async Task<IEnumerable<ChatMessage>> GetMessages(string logBookId)
        {
            var list = await _ChatMessages.Find(t => t.LogBookId == logBookId)
                .SortByDescending(t => t.Sent)
                .Limit(100)
                .ToListAsync();
            return list;
        }
    }
}
