import Head from "next/head";
import AdminLayout from "./layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import React from "react";


export default function Admin() {
  return (
    <>
      <Head>
        <title>UTOPIA NFT Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AdminLayout>
          <div className="flex h-full flex-col overflow-hidden p-4 text-white">
              <div className="py-4">
                  <Breadcrumb>
                      <BreadcrumbList>
                          <BreadcrumbItem>
                              <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                              <BreadcrumbPage className="text-white">Dashboard</BreadcrumbPage>
                          </BreadcrumbItem>
                      </BreadcrumbList>
                  </Breadcrumb>
              </div>
          </div>
      </AdminLayout>
    </>
);
}