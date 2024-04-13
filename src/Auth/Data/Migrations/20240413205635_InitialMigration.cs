using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Auth.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OpenIddictEntityFrameworkCoreScope",
                table: "OpenIddictEntityFrameworkCoreScope");

            migrationBuilder.RenameTable(
                name: "OpenIddictEntityFrameworkCoreScope",
                newName: "OpenIddictScopes");

            migrationBuilder.RenameIndex(
                name: "IX_OpenIddictEntityFrameworkCoreScope_Name",
                table: "OpenIddictScopes",
                newName: "IX_OpenIddictScopes_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OpenIddictScopes",
                table: "OpenIddictScopes",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_OpenIddictScopes",
                table: "OpenIddictScopes");

            migrationBuilder.RenameTable(
                name: "OpenIddictScopes",
                newName: "OpenIddictEntityFrameworkCoreScope");

            migrationBuilder.RenameIndex(
                name: "IX_OpenIddictScopes_Name",
                table: "OpenIddictEntityFrameworkCoreScope",
                newName: "IX_OpenIddictEntityFrameworkCoreScope_Name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_OpenIddictEntityFrameworkCoreScope",
                table: "OpenIddictEntityFrameworkCoreScope",
                column: "Id");
        }
    }
}
