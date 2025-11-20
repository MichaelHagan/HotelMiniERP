using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HotelMiniERP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ImplementStockTransactionSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventory_Vendors_VendorId",
                table: "Inventory");

            migrationBuilder.DropIndex(
                name: "IX_Inventory_Code",
                table: "Inventory");

            migrationBuilder.DropIndex(
                name: "IX_Inventory_VendorId",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "Model",
                table: "Inventory");

            migrationBuilder.DropColumn(
                name: "VendorId",
                table: "Inventory");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Inventory",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "StockTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InventoryId = table.Column<int>(type: "integer", nullable: false),
                    TransactionType = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    VendorId = table.Column<int>(type: "integer", nullable: true),
                    TransactionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReductionReason = table.Column<int>(type: "integer", nullable: true),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    UnitCost = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: true),
                    VendorId1 = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockTransactions_Inventory_InventoryId",
                        column: x => x.InventoryId,
                        principalTable: "Inventory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StockTransactions_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockTransactions_Vendors_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StockTransactions_Vendors_VendorId1",
                        column: x => x.VendorId1,
                        principalTable: "Vendors",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_CreatedByUserId",
                table: "StockTransactions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_InventoryId",
                table: "StockTransactions",
                column: "InventoryId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_VendorId",
                table: "StockTransactions",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_VendorId1",
                table: "StockTransactions",
                column: "VendorId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockTransactions");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Inventory",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "Inventory",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Inventory",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "Inventory",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VendorId",
                table: "Inventory",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_Code",
                table: "Inventory",
                column: "Code",
                unique: true);

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
    }
}
