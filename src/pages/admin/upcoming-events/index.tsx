/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */

import React, {useState} from "react";
import AdminLayout from "../layout";
import {api} from "~/utils/api";
import {zodResolver} from "@hookform/resolvers/zod";
import {BiMessageSquareEdit, BiTrash} from "react-icons/bi";
import {useForm} from "react-hook-form";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "~/components/ui/table";

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "~/components/ui/dialog";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

import {Alert, AlertTitle} from "~/components/ui/alert";

import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "~/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import {BsEyeFill, BsEyeSlashFill} from "react-icons/bs";
import {type IUpcomingEventUpdate, upcomingEventUpdateSchema,} from "~/validation/upcomingEventValidation";
import {type UpcomingEventPayload} from "~/server/api/routers/upcoming-event";
import Link from "next/link";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "~/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "~/components/ui/popover";
import {format} from "date-fns";
import {PopoverPortal} from "@radix-ui/react-popover";

export default function AdminEvents() {
  const { data: events, refetch } = api.upcomingEvent.get.useQuery();
  const { mutate: createMutation } = api.upcomingEvent.create.useMutation();
  const { mutate: updateMutation } = api.upcomingEvent.update.useMutation();
  const { mutate: deleteMutation } = api.upcomingEvent.delete.useMutation();
  const { mutate: publishMutation } = api.upcomingEvent.publish.useMutation();
  const { mutate: unpublishMutation } = api.upcomingEvent.unpublish.useMutation();

  // const [search, setSearch] = useState("");

  const [eventToDelete, setEventToDelete] = useState<UpcomingEventPayload>();
  const [eventToPublish, setEventToPublish] = useState<UpcomingEventPayload>();
  const [eventToUnpublish, setEventToUnpublish] = useState<UpcomingEventPayload>();

  const [alert, setAlert] = useState<{
    type: "default" | "destructive";
    message: string;
  }>({
    type: "default",
    message: "",
  });

  const eventForm = useForm<IUpcomingEventUpdate>({
    resolver: zodResolver(upcomingEventUpdateSchema),
  });
  const [eventFormDialogVisible, setEventFormDialogVisible] = useState(false);
  const [eventFormDialogBusy, setEventFormDialogBusy] = useState(false);

  const handleSubmit = async (form: IUpcomingEventUpdate) => {
    eventForm.getValues().id
      ? submitEventUpdate(form).catch(console.error)
      : submitEventCreate(form).catch(console.error);
  };

  const submitEventUpdate = async (form: IUpcomingEventUpdate) => {
    try {
      setEventFormDialogBusy(true);

      updateMutation(
        {
          id: form.id!,
          title: form.title,
          locationUrl: form.locationUrl,
          date: form.date,
          registerUrl: form.registerUrl ?? "",
        },
        {
          onSuccess: () => {
            showAlert("default", "Data Updated!");
            refetch().catch(console.error);
            eventForm.reset();
            handleCreateDialogVisibility(false);
            setEventFormDialogBusy(false);
          },
          onError: (error) => {
            console.error(error);
            showAlert("destructive", "Failed to update event!");
            setEventFormDialogBusy(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      showAlert("destructive", "Failed to upload image!");
      setEventFormDialogBusy(false);
    }
  };

  const submitEventCreate = async (form: IUpcomingEventUpdate) => {
    try {
      setEventFormDialogBusy(true);

      createMutation(
        {
          title: form.title,
          locationUrl: form.locationUrl,
          date: form.date,
          registerUrl: form.registerUrl ?? "",
        },
        {
          onSuccess: () => {
            showAlert("default", "Event Created!");
            refetch().catch(console.error);
            eventForm.reset();
            handleCreateDialogVisibility(false);
            setEventFormDialogBusy(false);
          },
          onError: (error) => {
            console.error(error);
            showAlert("destructive", "Failed to create event!");
            setEventFormDialogBusy(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      showAlert("destructive", "Failed to upload image!");
      setEventFormDialogBusy(false);
    }
  };

  const handleCreateDialogVisibility = (e: boolean) => {
    if (!e) {
      eventForm.reset();
      eventForm.setValue("id", undefined);
      eventForm.setValue("title", "");
      eventForm.setValue("locationUrl", "");
      eventForm.setValue("date", new Date());
      eventForm.setValue("registerUrl", "");
    }
    setEventFormDialogVisible(e);
  };

  const handleEditEvent = (event: UpcomingEventPayload) => {
    eventForm.setValue("id", event.id);
    eventForm.setValue("title", event.title);
    eventForm.setValue("locationUrl", event.locationUrl);
    eventForm.setValue("date", event.date);
    eventForm.setValue("registerUrl", event.registerUrl ?? "");
    setEventFormDialogVisible(true);
  };

  const handleDeleteEvent = () => {
    if (!eventToDelete) return;

    deleteMutation(
      { id: eventToDelete.id },
      {
        onSuccess: () => {
          showAlert("default", "Event Deleted!");
          refetch().catch(console.error);
          setEventToDelete(undefined);
        },
        onError: (error) => {
          console.error(error);
          showAlert("destructive", "Failed to delete event!");
        },
      },
    );
  };

  const handlePublishEvent = () => {
    if (!eventToPublish) return;

    publishMutation(
      { id: eventToPublish.id },
      {
        onSuccess: () => {
          showAlert("default", "Event Published!");
          refetch().catch(console.error);
          setEventToPublish(undefined);
        },
        onError: (error) => {
          console.error(error);
          showAlert("destructive", "Failed to publish the event!");
        },
      },
    );
  };

  const handleUnpublishEvent = () => {
    if (!eventToUnpublish) return;

    unpublishMutation(
      { id: eventToUnpublish.id },
      {
        onSuccess: () => {
          showAlert("default", "Event Unpublish!");
          refetch().catch(console.error);
          setEventToUnpublish(undefined);
        },
        onError: (error) => {
          console.error(error);
          showAlert("destructive", "Failed to unpublish event!");
        },
      },
    );
  };

  const showAlert = (type: "default" | "destructive", message: string) => {
    setAlert({
      type,
      message,
    });

    setTimeout(() => {
      setAlert({
        type: "default",
        message: "",
      });
    }, 1500);
  };

  return (
    <>
      <AdminLayout>
        <div className="flex h-full flex-col overflow-hidden p-4">
          <div className="py-4">
            <Breadcrumb className="text-white">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/admin"
                    className="text-slate-600">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-400">Upcoming Event</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold text-slate-400">Upcoming Events</h1>
          </div>
          <div className="flex items-center justify-between pb-2 pt-6">
            <div></div>
            {/*<Input*/}
            {/*  className="rounded-md border border-slate-800 h-8 w-56 bg-utopia-dark-grey"*/}
            {/*  placeholder="Search"*/}
            {/*  value={search}*/}
            {/*  onChange={(e) => setSearch(e.target.value)}*/}
            {/*/>*/}
            <Button
              className="px-4 border-2 border-utopia-admin-border bg-utopia-button-bg"
              onClick={() => setEventFormDialogVisible(true)}>
              Create
            </Button>
          </div>
          <div className="overflow-hidden bg-utopia-admin-bg text-white">
            <Table className="border border-slate-800">
              <TableHeader className="sticky top-0">
                <TableRow className="border-b border-t border-slate-800 bg-utopia-admin-bg hover:bg-utopia-admin-bg">
                  <TableHead className="w-[200px]">Title</TableHead>
                  <TableHead className="w-[300px]">Date</TableHead>
                  <TableHead className="w-[300px]">Location Url</TableHead>
                  <TableHead className="w-[300px]">Registration Url</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-auto border-r-slate-800">
                {events?.length ? (
                  events.map((event, index) => (
                    <TableRow
                      key={index}
                      className="border-slate-800 hover:bg-transparent">
                      <TableCell className="font-medium">{event.title}</TableCell>
                      <TableCell className="font-medium">{event.date.toDateString()}</TableCell>
                      <TableCell className="font-medium">
                        <Link href={event.locationUrl}>{event.locationUrl}</Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link
                          href={event.registerUrl ?? "#"}
                          className="text-white">
                          {event.registerUrl ?? "-"}
                        </Link>
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            title="Edit Event"
                            className="bg-utopia-button-bg p-3 hover:bg-slate-800"
                            onClick={() => handleEditEvent(event)}>
                            <BiMessageSquareEdit className="text-xl text-white-600" />
                          </Button>
                          <Button
                            title="Delete Event"
                            className="bg-red-700 p-3 hover:bg-red-900"
                            onClick={() => setEventToDelete(event)}>
                            <BiTrash className="text-xl text-white-600" />
                          </Button>
                          {event.status === "DRAFT" ? (
                            <Button
                              title="Publish Event"
                              className="bg-slate-700 p-3 hover:bg-slate-900"
                              onClick={() => setEventToPublish(event)}>
                              <BsEyeSlashFill className="text-xl text-white-600" />
                            </Button>
                          ) : (
                            <Button
                              title="Unpublish Event"
                              className="bg-slate-700 p-3 hover:bg-slate-900"
                              onClick={() => setEventToUnpublish(event)}>
                              <BsEyeFill className="text-xl text-white-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={5}
                      className="text-center">
                      <p className="text-slate-500 pb-4">Event still empty. Create One</p>
                      <Button
                        className="px-4 border-2 border-utopia-admin-border bg-utopia-button-bg"
                        onClick={() => setEventFormDialogVisible(true)}>
                        Create
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminLayout>

      <Dialog
        open={eventFormDialogVisible}
        onOpenChange={handleCreateDialogVisibility}>
        <DialogContent className="bg-utopia-admin-bg text-slate-400 border-slate-800">
          <DialogHeader>
            <DialogTitle>Create Upcoming Event</DialogTitle>
            <DialogDescription>Fill in the form to create new Upcoming Event</DialogDescription>
          </DialogHeader>
          <Form {...eventForm}>
            <form onSubmit={eventForm.handleSubmit(handleSubmit)}>
              <FormField
                control={eventForm.control}
                defaultValue=""
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: Utopia Weeks"
                        className="text-slate-400 bg-transparent border-slate-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                name="date"
                defaultValue={new Date()}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button className="flex items-center gap-2 w-full text-slate-400 bg-transparent border-slate-800"
                            variant={"outline"}
                            // className={cn(
                            //   "w-[240px] pl-3 text-left font-normal",
                            //   !field.value && "text-muted-foreground",
                            // )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverPortal>
                        <PopoverContent
                          className="w-auto p-0 z-[999]"
                          align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(e) => {
                              field.onChange(e);
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </PopoverPortal>
                    </Popover>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                defaultValue=""
                name="locationUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Location Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: https://maps.app.goo.gl/v6d...."
                        className="text-slate-400 bg-transparent border-slate-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={eventForm.control}
                defaultValue=""
                name="registerUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Registration Url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g: https://...."
                        className="text-slate-400 bg-transparent border-slate-800"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-8 bg-utopia-button-bg"
                disabled={eventFormDialogBusy}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(eventToDelete)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(eventToPublish)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish the event so anyone can see the event. You can un-publish it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToPublish(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishEvent}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(eventToUnpublish)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unpublish the event, so the event can no longer being seen. You can
              re-publish it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToUnpublish(undefined)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUnpublishEvent}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {alert.message && (
        <div className="fixed top-2 left-2 right-2 p-2 z-[9999]">
          <Alert
            className="w-max ml-auto"
            variant={alert.type}>
            <AlertTitle>{alert.message}</AlertTitle>
          </Alert>
        </div>
      )}
    </>
  );
}
