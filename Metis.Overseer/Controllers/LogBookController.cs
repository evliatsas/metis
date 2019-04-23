using Metis.Overseer.Services;
using Metis.Teamwork.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

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
            var books = await _logService.GetBooks();

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
            .OrderBy(o=>o.Name);

            return Ok(members);
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetBook(string id)
        {
            var book = await _logService.GetBook(id);

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
            entry.LogBookId = bookId;
            var inserted = await _logService.Create(entry);

            return Ok(inserted);
        }

        [Route("{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateBook(string id, [FromBody] LogBook book)
        {
            await _logService.Update(id, book);

            return Ok();
        }

        [Route("{bookId}/entries/{entryId}")]
        [HttpPut]
        public async Task<IActionResult> UpdateEntry(string bookId, string entryId, [FromBody] LogEntry entry)
        {
            entry.LogBookId = bookId;
            await _logService.Update(entryId, entry);

            return Ok();
        }

        [Route("{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteBook(string id)
        {
            await _logService.RemoveBook(id);

            return Ok();
        }

        [Route("{bookId}/entries/{entryId}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteEntry(string bookId, string entryId)
        {
            await _logService.RemoveEntry(entryId);

            return Ok();
        }
    }
}