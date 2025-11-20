using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMiniERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnnecessaryInventoryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PurchaseDate",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "SerialNumber",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "WarrantyExpiry",
                table: "Inventory");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "PurchaseDate",
                table: "Inventory",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SerialNumber",
                table: "Inventory",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WarrantyExpiry",
                table: "Inventory",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
