using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErpStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCoverImageUrlToCompanySettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "CompanySettings",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "CompanySettings");
        }
    }
}
