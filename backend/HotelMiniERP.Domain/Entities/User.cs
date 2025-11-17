using HotelMiniERP.Domain.Common;
using HotelMiniERP.Domain.Enums;
using System;

namespace HotelMiniERP.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string? Department { get; set; }
        public string? Position { get; set; }
        public DateTime? HireDate { get; set; }
        public bool IsActive { get; set; } = true;
        public string? ProfilePicture { get; set; }
        public string? Address { get; set; }
        public DateTime? LastLogin { get; set; }

        // Navigation properties
        public ICollection<WorkOrder> AssignedWorkOrders { get; set; } = new List<WorkOrder>();
        public ICollection<WorkOrder> RequestedWorkOrders { get; set; } = new List<WorkOrder>();
        public ICollection<WorkerComplaint> SubmittedComplaints { get; set; } = new List<WorkerComplaint>();
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    }
}