using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErpStore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddElectronicBillingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:unaccent", ",,");

            migrationBuilder.AddColumn<string>(
                name: "AccessKey",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AuthorizationDate",
                table: "Sales",
                type: "timestamp without time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthorizationNumber",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ElectronicStatus",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsElectronic",
                table: "Sales",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SriErrorMessage",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "XmlPath",
                table: "Sales",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CommercialName",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ElectronicBillingEnabled",
                table: "CompanySettings",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ElectronicSignaturePassword",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ElectronicSignaturePath",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IvaRate",
                table: "CompanySettings",
                type: "numeric(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "SriEnvironment",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SriEstablishment",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SriPointOfIssue",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TributaryRegime",
                table: "CompanySettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdentificationType",
                table: "Clients",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessKey",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "AuthorizationDate",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "AuthorizationNumber",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "ElectronicStatus",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "IsElectronic",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "SriErrorMessage",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "XmlPath",
                table: "Sales");

            migrationBuilder.DropColumn(
                name: "CommercialName",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "ElectronicBillingEnabled",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "ElectronicSignaturePassword",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "ElectronicSignaturePath",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "IvaRate",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "SriEnvironment",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "SriEstablishment",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "SriPointOfIssue",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "TributaryRegime",
                table: "CompanySettings");

            migrationBuilder.DropColumn(
                name: "IdentificationType",
                table: "Clients");

            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:unaccent", ",,");
        }
    }
}
