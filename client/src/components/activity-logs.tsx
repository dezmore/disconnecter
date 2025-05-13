import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeForLogs } from "@/lib/utils";
import type { ActivityLog } from "@shared/schema";

type LogStatusBadgeProps = {
  status: string;
};

const LogStatusBadge = ({ status }: LogStatusBadgeProps) => {
  let bgColor = "";
  let textColor = "";

  switch (status) {
    case "Success":
      bgColor = "bg-discord-success bg-opacity-20";
      textColor = "text-discord-success";
      break;
    case "No Action":
      bgColor = "bg-discord-warning bg-opacity-20";
      textColor = "text-discord-warning";
      break;
    case "Manual":
      bgColor = "bg-discord-primary bg-opacity-20";
      textColor = "text-discord-primary";
      break;
    default:
      bgColor = "bg-discord-light bg-opacity-20";
      textColor = "text-discord-light";
  }

  return (
    <span className={`px-2 py-1 text-xs ${bgColor} ${textColor} rounded-full`}>
      {status}
    </span>
  );
};

type ActivityLogsProps = {
  logs: ActivityLog[];
};

export function ActivityLogs({ logs }: ActivityLogsProps) {
  return (
    <Card className="mt-6 bg-discord-secondary border-none rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-5 border-b border-gray-700 flex flex-row items-center justify-between">
        <CardTitle className="font-medium text-base">Recent Activity Logs</CardTitle>
        <Button variant="link" className="text-xs text-discord-light hover:text-white">
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-discord-darker">
              <TableRow>
                <TableHead className="text-left text-xs font-medium text-discord-light uppercase">Time</TableHead>
                <TableHead className="text-left text-xs font-medium text-discord-light uppercase">Event</TableHead>
                <TableHead className="text-left text-xs font-medium text-discord-light uppercase">Details</TableHead>
                <TableHead className="text-left text-xs font-medium text-discord-light uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-discord-light">
                    No activity logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-discord-light">
                      {formatDateTimeForLogs(new Date(log.timestamp))}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.event}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-discord-light">
                      {log.details}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <LogStatusBadge status={log.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
