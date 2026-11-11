using System.Text;
using AiTicket.Api.Contracts;

namespace AiTicket.Api.Modules.Analytics;

internal static class SqlFilterBuilder
{
    public static (string Sql, Dictionary<string, object?> Parameters) BuildCookieWhere(
        PeriodFilter filter,
        int defaultCookieTypeId,
        string cookieAlias = "c")
    {
        var sql = new StringBuilder($" WHERE {cookieAlias}.CookieTypeId = @cookieTypeId ");
        var parameters = new Dictionary<string, object?>
        {
            ["cookieTypeId"] = defaultCookieTypeId
        };

        if (filter.From is not null)
        {
            sql.Append($" AND {cookieAlias}.CookieTime >= @from ");
            parameters["from"] = filter.From.Value;
        }

        if (filter.To is not null)
        {
            sql.Append($" AND {cookieAlias}.CookieTime < @to ");
            parameters["to"] = filter.To.Value.Date.AddDays(1);
        }

        if (filter.DepartmentId is not null)
        {
            sql.Append($" AND {cookieAlias}.DepartmentId = @departmentId ");
            parameters["departmentId"] = filter.DepartmentId.Value;
        }

        if (filter.SubjectClassId is not null)
        {
            sql.Append($" AND {cookieAlias}.SubjectClassId = @subjectClassId ");
            parameters["subjectClassId"] = filter.SubjectClassId.Value;
        }

        if (filter.ChannelId is not null)
        {
            sql.Append($" AND {cookieAlias}.CookieChannelId = @channelId ");
            parameters["channelId"] = filter.ChannelId.Value;
        }

        if (filter.ZoneId is not null)
        {
            sql.Append($" AND {cookieAlias}.ZoneId = @zoneId ");
            parameters["zoneId"] = filter.ZoneId.Value;
        }

        return (sql.ToString(), parameters);
    }

    public static string PeriodLabel(PeriodFilter filter)
    {
        if (filter.From is null && filter.To is null)
        {
            return "کل دوره تاریخی فیلترنشده";
        }

        var from = filter.From?.ToString("yyyy-MM-dd") ?? "…";
        var to = filter.To?.ToString("yyyy-MM-dd") ?? "…";
        return $"{from} → {to}";
    }
}
