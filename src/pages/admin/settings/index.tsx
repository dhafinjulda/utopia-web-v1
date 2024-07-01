// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-misused-promises */
//
// import React, {useState} from "react";
// import AdminLayout from "../layout";
// import {api} from "~/utils/api";
// import {zodResolver} from "@hookform/resolvers/zod"
// import {useForm} from "react-hook-form";
//
// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "~/components/ui/dialog";
//
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "~/components/ui/breadcrumb"
//
// import {Alert, AlertTitle} from "~/components/ui/alert"
//
//
// import {Button} from "~/components/ui/button";
// import {Input} from "~/components/ui/input"
//
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "~/components/ui/form"
// import {type IUpcomingEventUpdate} from "~/validation/upcomingEventValidation";
// import {type UpcomingEventPayload} from "~/server/api/routers/upcoming-event";
// import {updateAppSettingSchema} from "~/validation/appSettingsValidation";
//
// export default function AdminEvents() {
//   const { data: settings, refetch } = api.setting.getAppSetting.useQuery();
//   const { mutate: updateMutation } = api.setting.update.useMutation();
//
//   // const [search, setSearch] = useState("");
//
//   const [eventToDelete, setEventToDelete] = useState<UpcomingEventPayload>();
//   const [eventToPublish, setEventToPublish] = useState<UpcomingEventPayload>();
//   const [eventToUnpublish, setEventToUnpublish] = useState<UpcomingEventPayload>();
//
//   const [alert, setAlert] = useState<{
//     type: 'default' | 'destructive',
//     message: string
//   }>({
//     type: 'default',
//     message: ''
//   });
//
//   const settingForm = useForm<updateAppSettingSchema>({
//     resolver: zodResolver(updateAppSettingSchema)
//   })
//   const [eventFormDialogVisible, setEventFormDialogVisible] = useState(false);
//   const [eventFormDialogBusy, setEventFormDialogBusy] = useState(false);
//
//   const handleSubmit =  async (form: IUpcomingEventUpdate) => {
//     settingForm.getValues().id ? submitEventUpdate(form).catch(console.error) : submitEventCreate(form).catch(console.error)
//   };
//
//
//   const submitEventUpdate = async (form: IUpcomingEventUpdate) => {
//     try {
//       setEventFormDialogBusy(true);
//
//       updateMutation({
//         id: form.id!,
//         title: form.title,
//         locationUrl: form.locationUrl,
//         date: form.date,
//         registerUrl: form.registerUrl ?? "",
//       }, {
//         onSuccess: () => {
//           showAlert('default', 'Event Updated!');
//           refetch().catch(console.error);
//           setEventFormDialogBusy(false);
//         },
//         onError: (error) => {
//           console.error(error);
//           showAlert('destructive', 'Failed to update event!');
//           setEventFormDialogBusy(false);
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       showAlert('destructive', 'Failed to upload image!');
//       setEventFormDialogBusy(false);
//     }
//   }
//
//
//   const showAlert = (type: 'default' | 'destructive', message: string) => {
//     setAlert({
//       type,
//       message,
//     });
//
//     setTimeout(() => {
//       setAlert({
//         type: 'default',
//         message: '',
//       });
//     }, 1500);
//   }
//
//   return (
//     <>
//       <AdminLayout>
//         <div className="flex h-full flex-col overflow-hidden p-4">
//           <div className="py-4">
//             <Breadcrumb className="text-white">
//               <BreadcrumbList>
//                 <BreadcrumbItem>
//                   <BreadcrumbLink href="/admin" className="text-slate-600">Home</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage className="text-slate-400">App Settings</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//             <h1 className="text-2xl font-bold text-slate-400">Events</h1>
//           </div>
//           <div className="overflow-hidden bg-utopia-admin-bg text-white">
//
//           </div>
//         </div>
//       </AdminLayout>
//
//       <Dialog open={eventFormDialogVisible} onOpenChange={handleCreateDialogVisibility}>
//         <DialogContent className="bg-utopia-admin-bg text-slate-400 border-slate-800">
//           <DialogHeader>
//             <DialogTitle>Create Upcoming Event</DialogTitle>
//             <DialogDescription>Fill in the form to create new Upcoming Event</DialogDescription>
//           </DialogHeader>
//           <Form {...settingForm}>
//             <form onSubmit={settingForm.handleSubmit(handleSubmit)}>
//               <FormField
//                 control={settingForm.control}
//                 defaultValue=""
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Event Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g: Utopia Weeks" className="text-slate-400 bg-transparent border-slate-800" {...field} />
//                     </FormControl>
//                     <FormMessage></FormMessage>
//                   </FormItem>
//                 )}
//               />
//               <Button type="submit" className="mt-8 bg-utopia-button-bg" disabled={eventFormDialogBusy}>Submit</Button>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>
//
//
//       {
//         alert.message && (
//           <div className="fixed top-2 left-2 right-2 p-2 z-[9999]">
//             <Alert className="w-max ml-auto" variant={alert.type}>
//               <AlertTitle>{alert.message}</AlertTitle>
//             </Alert>
//           </div>
//         )
//       }
//     </>
//   );
// }

export default function Settings(){
  return (
    <div>

    </div>
  )
}