using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErpStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSessionIdToSalesAndExpenses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CashRegisterSessionId",
                table: "Sales",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CashRegisterSessionId",
                table: "Expenses",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sales_CashRegisterSessionId",
                table: "Sales",
                column: "CashRegisterSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_CashRegisterSessionId",
                table: "Expenses",
                column: "CashRegisterSessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_CashRegisterSessions_CashRegisterSessionId",
                table: "Expenses",
                column: "CashRegisterSessionId",
                principalTable: "CashRegisterSessions",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sales_CashRegisterSessions_CashRegisterSessionId",
                table: "Sales",
                column: "CashRegisterSessionId",
                principalTable: "CashRegisterSessions",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_CashRegisterSessions_CashRegisterSessionId",
                table: "Expenses");

            migrationBuilder.DropForeignKey(
                name: "FK_Sales_CashRegisterSessions_CashRegisterSessionId",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_Sales_CashRegisterSessionId",
                table: "Sales");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_CashRegisterSessionId",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "CashRegisterSessionId",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "CashRegisterSessionId",
                table: "Expenses");
        }
    }
}
