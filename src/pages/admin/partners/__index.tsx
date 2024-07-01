// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-misused-promises */
//
// import React, { useState } from "react";
// import AdminLayout from "../layout";
// import Image from "next/image";
// import { api } from "~/utils/api";
// import { zodResolver } from "@hookform/resolvers/zod"
// import { BiMessageSquareEdit, BiTrash } from "react-icons/bi";
// import axios from "axios";
// import { z } from "zod";
//
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "~/components/ui/table";
//
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "~/components/ui/dialog";
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
// import {
//   Alert,
//   AlertTitle
// } from "~/components/ui/alert"
//
//
// import { Button } from "~/components/ui/button";
// import { Input } from "~/components/ui/input"
//
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "~/components/ui/form"
//
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "~/components/ui/alert-dialog"
//
// import { useForm } from "react-hook-form";
// import { type IPartnerUpdate } from "~/validation/partnerValidation";
// import { type PartnerWithImages } from "~/server/api/routers/partner";
//
// export default function AdminPartners() {
//   const { data: partners, refetch } = api.partner.get.useQuery();
//   const { mutate: createMutation } = api.partner.create.useMutation();
//   const { mutate: updateMutation } = api.partner.update.useMutation();
//   const { mutate: deleteMutation } = api.partner.delete.useMutation();
//
//   const [search, setSearch] = useState("");
//
//   const [partnerFormDialogVisible, setPartnerFormDialogVisible] = useState(false);
//   const [partnerFormDialogBusy, setPartnerFormDialogBusy] = useState(false);
//
//   const [partnerToDelete, setPartnerToDelete] = useState<PartnerWithImages>();
//   // const [partnerToPublish, setPartnerToPublish] = useState<PartnerWithImages>();
//   // const [partnerToUnpublish, setPartnerToUnpublish] = useState<PartnerWithImages>();
//
//   const [filePreview, setFilePreview] = useState<{
//     name: string
//     path: string
//     progress: number
//     file: File | null
//   }[]>([]);
//
//   const [alert, setAlert] = useState<{
//     type: 'default' | 'destructive',
//     message: string
//   }>({
//     type: 'default',
//     message: ''
//   });
//
//
//   const partnerForm = useForm<IPartnerUpdate>({
//     resolver: zodResolver(
//       z.object({
//         id: z.number().optional(),
//         name: z.string().optional(),
//         description: z.string().optional(),
//         images: z.array(z.string()).optional(),
//       })
//       .refine((data) => (Boolean(data.id) || Boolean(data.name?.length)), {
//         message: 'Event Name field required',
//         path: ['name'],
//       })
//     ),
//   });
//
//
//   const handleChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files) return;
//
//     const files = e.target.files;
//
//     const promises = Array.from(files).map((file) => {
//       const reader = new FileReader();
//
//       return new Promise<{
//         name: string
//         path: string
//         progress: number
//         file: File
//       }>((resolve) => {
//         reader.onload = (e) => {
//           resolve({
//             name: file.name,
//             progress: 0,
//             path: (e.target?.result ?? '') as string,
//             file,
//           });
//         };
//         reader.readAsDataURL(file);
//       });
//     });
//
//     Promise.all(promises)
//     .then((result) => setFilePreview(result))
//     .catch(console.error);
//   };
//
//   const handleUploadImage = async () => {
//     const imagePaths: string[] = [];
//
//     await new Promise((resolve) => {
//       filePreview.forEach(async (file, index) => {
//         if (file.file) {
//
//
//           const path = await new Promise<string>((resolve, _) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result as string);
//             reader.readAsDataURL(file.file!);
//           });
//
//           imagePaths.push(path);
//         }
//
//         if (index === filePreview.length - 1) {
//           resolve(null);
//         }
//       })
//     })
//
//     return imagePaths;
//   }
//
//   const handleSubmit = async (form: IPartnerUpdate) => {
//     if (partnerForm.getValues().id) submitPartnerUpdate(form).catch(console.error);
//     else submitPartnerCreate(form).catch(console.error);
//   };
//
//
//   const submitPartnerUpdate = async (form: IPartnerUpdate) => {
//     try {
//       setPartnerFormDialogBusy(true);
//
//       const imagePaths = await handleUploadImage();
//
//       updateMutation({
//         id: form.id!,
//         name: form.name!,
//         description: form.description,
//         images: imagePaths,
//       }, {
//         onSuccess: () => {
//           showAlert('default', 'Partner Updated!');
//           refetch().catch(console.error);
//           partnerForm.reset();
//           handleCreateDialogVisibility(false);
//           setPartnerFormDialogBusy(false);
//         },
//         onError: (error) => {
//           console.error(error);
//           showAlert('destructive', 'Failed to update Partner!');
//           setPartnerFormDialogBusy(false);
//         }
//       });
//     } catch (error) {
//       console.error(error);
//       showAlert('destructive', 'Failed to upload image!');
//       setPartnerFormDialogBusy(false);
//     }
//   }
//
//   const submitPartnerCreate = async (form: IPartnerUpdate) => {
//     if(!filePreview.length) {
//       showAlert('destructive', 'Please upload at least one image!');
//       return;
//     }
//
//     try {
//       setPartnerFormDialogBusy(true);
//
//       const imagePaths = await handleUploadImage();
//
//       createMutation({
//         name: form.name!,
//         description: form.description,
//         images: imagePaths,
//       }, {
//         onSuccess: () => {
//           showAlert('default', 'Partner Created!');
//           refetch().catch(console.error);
//           partnerForm.reset();
//           handleCreateDialogVisibility(false);
//           setPartnerFormDialogBusy(false);
//         },
//         onError: (error) => {
//           console.error(error);
//           showAlert('destructive', 'Failed to create Partner!');
//           setPartnerFormDialogBusy(false);
//         }
//       });
//
//     } catch (error) {
//       console.error(error);
//       showAlert('destructive', 'Failed to upload image!');
//       setPartnerFormDialogBusy(false);
//     }
//   }
//
//
//   const handleCreateDialogVisibility = (e: boolean) => {
//     if (!e) {
//       partnerForm.reset();
//       partnerForm.setValue('id', undefined);
//       partnerForm.setValue('name', '');
//       partnerForm.setValue('description', '');
//       partnerForm.setValue('images', []);
//       setFilePreview([]);
//     }
//     setPartnerFormDialogVisible(e);
//   }
//
//   const handleEditPartner = (partner: PartnerWithImages) => {
//     partnerForm.setValue('id', partner.id);
//     partnerForm.setValue('name', partner.name);
//     partnerForm.setValue('description', partner.description ?? '');
//     partnerForm.setValue('images', []);
//
//     setFilePreview([
//       ...partner.images.map((image) => ({
//         name: image.path,
//         path: image.path,
//         progress: 100,
//         file: null
//       }))
//     ])
//
//     setPartnerFormDialogVisible(true);
//   }
//
//   const handleDeletePartner = () => {
//     if (!partnerToDelete) return;
//
//     deleteMutation({ id: partnerToDelete.id }, {
//       onSuccess: () => {
//         showAlert('default', 'Event Deleted!');
//         refetch().catch(console.error);
//         setPartnerToDelete(undefined);
//       },
//       onError: (error) => {
//         console.error(error);
//         showAlert('destructive', 'Failed to delete event!');
//       }
//     })
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
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/admin" className="text-slate-600">Home</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage className="text-slate-400">Partners</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//             <h1 className="text-2xl font-bold text-slate-400">Partners</h1>
//           </div>
//           <div className="flex items-center justify-between pb-2 pt-6">
//             <Input
//               className="rounded-md border border-slate-800 h-8 w-56 bg-utopia-admin-bg  "
//               placeholder="Search"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <Button
//                 className="px-4 border-2 border-utopia-admin-border bg-utopia-button-bg"
//                 onClick={() => setPartnerFormDialogVisible(true)}>
//                 Create
//             </Button>
//           </div>
//           <div className="overflow-hidden bg-utopia-admin-bg text-white">
//             <Table className="border border-slate-800">
//               <TableHeader className="sticky top-0">
//                 <TableRow className="bg-utopia-admin-bg border-slate-800 hover:bg-utopia-admin-bg">
//                   <TableHead className="w-[200px]">Name</TableHead>
//                   <TableHead className="w-[200px]">Image</TableHead>
//                   <TableHead>URL</TableHead>
//                   <TableHead></TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody className="overflow-auto border-r-slate-800">
//                 {
//                   partners?.length ?
//                   partners.map((partner, index) => (
//                   <TableRow key={index} className="border-slate-800 hover:bg-transparent">
//                     <TableCell className="font-medium">{partner.name}</TableCell>
//                     <TableCell>
//                       <div className="grid grid-cols-2 gap-3">
//                         {
//                           partner.images.map((image, index) => (
//                             <Image
//                               key={index}
//                               src={`${image.path ?? ''}`}
//                               alt={`Image of ${partner.name}`}
//                               height={40}
//                               width={40}
//                             />
//                           ))
//                         }
//                       </div>
//                     </TableCell>
//                     <TableCell>{partner.description}</TableCell>
//                     <TableCell align="right">
//                       <div className="flex items-center justify-end gap-3">
//                         <Button className="bg-slate-50 p-3 hover:bg-slate-200" onClick={() => handleEditPartner(partner)}>
//                           <BiMessageSquareEdit className="text-xl text-slate-600" />
//                         </Button>
//                         <Button title="Delete Event" className="bg-red-700 p-3 hover:bg-red-900" onClick={() => setPartnerToDelete(partner)}>
//                             <BiTrash className="text-xl text-white-600" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                   ))
//                   :
//                   <TableRow className="hover:bg-transparent">
//                     <TableCell colSpan={4} className="text-center">
//                       <p className="text-slate-500 pb-4">Partner still empty. Create One</p>
//                         <Button
//                             className="px-4 border-2 border-utopia-admin-border bg-utopia-button-bg"
//                             onClick={() => setPartnerFormDialogVisible(true)}>
//                             Create
//                         </Button>
//                     </TableCell>
//                   </TableRow>
//                 }
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </AdminLayout>
//
//       <Dialog open={partnerFormDialogVisible} onOpenChange={handleCreateDialogVisibility}>
//         <DialogContent className="bg-utopia-admin-bg text-slate-400 border-slate-800">
//             <DialogHeader>
//                 <DialogTitle>Create Partner</DialogTitle>
//                 <DialogDescription>Fill in the form to create new Partner</DialogDescription>
//             </DialogHeader>
//             <Form {...partnerForm}>
//                 <form onSubmit={partnerForm.handleSubmit(handleSubmit)}>
//                     <FormField
//                         control={partnerForm.control}
//                         defaultValue=""
//                         name="name"
//                         render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Partner Name</FormLabel>
//                             <FormControl>
//                                 <Input placeholder="e.g: Utopia Media Partner" className="text-slate-400 bg-transparent border-slate-800" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                         )}
//                     />
//                     <FormField
//                         control={partnerForm.control}
//                         defaultValue=""
//                         name="description"
//                         render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Partner URL</FormLabel>
//                             <FormControl>
//                                 <Input placeholder="e.g: https://partner.com" className="text-slate-400 bg-transparent border-slate-800" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                         )}
//                     />
//                     <div className="grid grid-cols-3 gap-4">
//                       <div className="col-span-2">
//                       <FormField
//                           defaultValue={undefined}
//                           name="images"
//                           render={(_) => (
//                           <FormItem>
//                               <FormLabel>Partner Image</FormLabel>
//                               <FormControl>
//                                 <>
//                                   <input type="file" accept="image/png, image/jpeg, image/webp" onInput={handleChangeImages} />
//                                   <div className="grid grid-cols-3 gap-3 h-20 w-full">
//                                     {
//                                       filePreview.map((file, index) => (
//                                       <div className="relative" key={index}>
//                                         <Image
//                                           className="object-contain border border-slate-800 rounded"
//                                           src={file.path}
//                                           alt={`Preview Event Image (File ${index + 1} of ${filePreview.length})`}
//                                           fill
//                                         />
//                                       </div>
//                                       ))
//                                   }
//                                   </div>
//                                 </>
//                               </FormControl>
//                               <FormMessage />
//                           </FormItem>
//                           )}
//                       />
//                       </div>
//                     </div>
//                     <Button type="submit" className="mt-8" disabled={partnerFormDialogBusy}>Submit</Button>
//                 </form>
//             </Form>
//         </DialogContent>
//       </Dialog>
//
//       <AlertDialog open={Boolean(partnerToDelete)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the event.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel onClick={() => setPartnerToDelete(undefined)}>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeletePartner}>Continue</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//
//
//       {
//         alert.message && (
//         <div className="fixed top-2 left-2 right-2 p-2 z-[9999]">
//           <Alert className="w-max ml-auto" variant={alert.type}>
//             <AlertTitle>{alert.message}</AlertTitle>
//           </Alert>
//         </div>
//         )
//       }
//     </>
//   );
// }

export default function Partner(){
  return (
    <div>

    </div>
  )
}