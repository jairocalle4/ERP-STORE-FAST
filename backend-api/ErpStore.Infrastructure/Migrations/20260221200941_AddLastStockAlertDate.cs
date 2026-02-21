using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErpStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddLastStockAlertDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastStockAlertDate",
                table: "CompanySettings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastStockAlertDate",
                table: "CompanySettings");
        }
    }
}
