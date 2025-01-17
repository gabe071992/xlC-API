
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const securityFormSchema = z.object({
  multiSigRequired: z.boolean(),
  minApprovals: z.string(),
  emergencyPause: z.boolean(),
  auditLogEnabled: z.boolean(),
  maxDailyTransactions: z.string(),
  adminAddresses: z.array(z.string())
})

export default function SecurityControls() {
  const form = useForm({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      multiSigRequired: false,
      minApprovals: "2",
      emergencyPause: false,
      auditLogEnabled: true,
      maxDailyTransactions: "1000",
      adminAddresses: []
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="multiSigRequired"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Multi-Signature Required</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minApprovals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Approvals</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emergencyPause"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Emergency Pause Enabled</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit">Save Security Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
