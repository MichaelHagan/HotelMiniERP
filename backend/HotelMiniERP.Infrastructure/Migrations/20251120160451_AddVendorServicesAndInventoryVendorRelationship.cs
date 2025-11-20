using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelMiniERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddVendorServicesAndInventoryVendorRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Supplier",
                table: "Inventory");

            migrationBuilder.AddColumn<string>(
                name: "Services",
                table: "Vendors",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VendorId",
                table: "Inventory",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_VendorId",
                table: "Inventory",
                column: "VendorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventory_Vendors_VendorId",
                table: "Inventory",
                column: "VendorId",
                principalTable: "Vendors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventory_Vendors_VendorId",
                table: "Inventory");

            migrationBuilder.DropIndex(
                name: "IX_Inventory_VendorId",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "Services",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "VendorId",
                table: "Inventory");

            migrationBuilder.AddColumn<string>(
                name: "Supplier",
                table: "Inventory",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }
    }
}
