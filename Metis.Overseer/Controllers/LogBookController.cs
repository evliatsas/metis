using System;
using Metis.Overseer.Services;
using Metis.Teamwork.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Metis.Overseer.Extensions;

namespace Metis.Overseer.Controllers
{
    [ApiController]
    [Route("api/logbooks")]
    public class LogBookController : ControllerBase
    {
        private readonly LogService _logService;
        private readonly UserService _userService;

        public LogBookController(LogService logService, UserService userService)
        {
            _logService = logService;
            _userService = userService;
        }

        [Route("")]
        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var books = await _logService.GetBooks(userId);

            return Ok(books);
        }

        [Route("members")]
        [HttpGet]
        public async Task<IActionResult> GetBookMembers()
        {
            var users = await _userService.GetForMembers();
            var members = users.Select(user => new Member()
            {
                UserId = user.Id,
                Name = user.Title,
                Email = user.Email
            })
            .OrderBy(o => o.Name);

            return Ok(members);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetBook(string id)
        {
            var userId = User.Identity.GetUserId();
            var book = new LogBook();

            if (id == "new")
            {
                var email = User.Identity.GetEmail();
                var title = User.Identity.GetTitle();
                book.Owner = new Member
                {
                    Email = email,
                    UserId = userId,
                    Name = title
                };
                book.Close = DateTime.Now.AddDays(1);
                book.Members.Add(book.Owner);
                return Ok(book);
            }

            book = await _logService.GetBook(id);
            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            return Ok(book);
        }

        [Route("{bookId}/entries/{entryId}")]
        [HttpGet]
        public async Task<IActionResult> GetBookEntry(string bookId, string entryId)
        {
            var entry = await _logService.GetEntry(entryId);

            return Ok(entry);
        }

        [Route("")]
        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] LogBook book)
        {
            var inserted = await _logService.Create(book);

            return Ok(inserted);
        }

        [Route("{bookId}/entries")]
        [HttpPost]
        public async Task<IActionResult> CreateEntry(string bookId, [FromBody] LogEntry entry)
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var book = await _logService.GetBook(bookId);

            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            entry.LogBookId = bookId;
            var inserted = await _logService.Create(entry);

            return Ok(inserted);
        }

        [Route("{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateBook(string id, [FromBody] LogBook model)
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var book = await _logService.GetBook(id);

            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            await _logService.Update(id, model);

            return Ok();
        }

        [Route("{bookId}/entries/{entryId}")]
        [HttpPut]
        public async Task<IActionResult> UpdateEntry(string bookId, string entryId, [FromBody] LogEntry model)
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var book = await _logService.GetBook(bookId);
            var entry = await _logService.GetEntry(entryId);

            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            if (entry.Issuer.UserId != userId && entry.Recipient.UserId != userId)
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            model.LogBookId = bookId;
            await _logService.Update(entryId, model);

            return Ok();
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteBook(string id)
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var book = await _logService.GetBook(id);

            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            await _logService.RemoveBook(id);

            return Ok();
        }

        [Route("{bookId}/entries/{entryId}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteEntry(string bookId, string entryId)
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var book = await _logService.GetBook(bookId);
            var entry = await _logService.GetEntry(entryId);

            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            if (entry.Issuer.UserId != userId && entry.Recipient.UserId != userId)
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            await _logService.RemoveEntry(entryId);

            return Ok();
        }

        [Route("{bookId}/entries/{entryId}/close")]
        [HttpGet]
        public async Task<IActionResult> CloseEntry(string bookId, string entryId)
        {
            var claim = User.Claims.FirstOrDefault(t => t.Type == "userid");
            var userId = claim != null ? claim.Value : "";

            var book = await _logService.GetBook(bookId);
            var entry = await _logService.GetEntry(entryId);

            if (book.Owner.UserId != userId && !book.Members.Any(t => t.UserId == userId))
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            if (entry.Issuer.UserId != userId && entry.Recipient.UserId != userId)
            {
                throw new Exception("Your account has no permission for this entry.");
            }

            entry.CompletionTime = DateTime.Now;
            entry.Status = Status.Closed;
            await _logService.Update(entryId, entry);

            return Ok(entry);
        }

        [Route("{bookId}/messages")]
        [HttpGet]
        public async Task<IActionResult> GetMessages(string bookId)
        {
            var data = await _logService.GetMessages(bookId);

            return Ok(data);
        }
    }
}