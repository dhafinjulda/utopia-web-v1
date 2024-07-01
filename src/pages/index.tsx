import Image from "next/image";
import React, { type ReactNode, useEffect, useState } from "react";

import { api } from "~/utils/api";

import { Carousel, CarouselContent, CarouselItem } from "~/components/ui/carousel";

import { type EventWithImages } from "~/server/api/routers/event";
import HeaderDefault from "~/components/HeaderDefault";
import Head from "next/head";
import ButtonDefault from "~/components/button/button-default";
import { format } from "date-fns";

type eventWithImagesAndId = {
  image: string;
  id: number;
};

const DEFAULT_EVENT: EventWithImages = {
  id: 0,
  name: "Event Name",
  description: "Event Description",
  images: [
    {
      id: 0,
      deleted: false,
      path: "/images/dummies/event/event1.png",
      createdAt: new Date(),
      updatedAt: new Date(),
      galleryId: null,
    },
  ],
  status: "DRAFT",
  createdAt: new Date(),
  createdById: 1,
  updatedAt: new Date(),
};

export default function Home() {
  const { data: events } = api.event.getFront.useQuery({
    limit: 6,
    page: 1,
  });
  // const { data: partners } = api.partner.get.useQuery();

  const [eventHero, setEventHero] = useState(DEFAULT_EVENT.images.map((image) => { return {
    image: image.path,
    id: DEFAULT_EVENT.id
  }}));

  const [eventDetail, setEventDetail] = useState<EventWithImages>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const eventImages =
      events?.data.reduce((carry: eventWithImagesAndId[], event: EventWithImages) => {
        return [...carry, ...event.images.map((image) => {
          return {
            image: image.path,
            id: event.id
          }
        })];
      }, []) ?? [];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setEventHero(eventImages);
  }, [events]);

  useEffect(() => {
    if (events && !eventDetail){
      events.data.length > 0 && setEventDetail(events.data[0])
    }
  }, [eventDetail, events]);

  const handleEventDetailChange = (id: number) => {
    if (!events) return
    const event = events.data.find((event) => event.id === id);
    setEventDetail(event)
  }

  //$Gallery Data
  const { data: galleryData, isSuccess:gallerySuccessFetch } = api.gallery.getFront.useQuery();

  //#region components
  const HtmlHead = (): ReactNode => {
    return (
      <Head>
        <title>UTOPIA - NFT</title>
      </Head>
    );
  };

  const UpcomingEvents = (): ReactNode => {
    const { data, isSuccess } = api.upcomingEvent.getFront.useQuery({limit: 10, page: 1});

    return (
      <div className="rounded-3xl bg-white/20 w-96 overflow-hidden">
        <div className="bg-white/20 p-3">
          <h2 className="text-2xl text-center text-white font-semibold">Upcoming Events</h2>
        </div>
        {isSuccess &&
          data.data.map((item, index) => (
            <div
              className="p-3"
              key={index}>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-lg font-bold text-white">{item.title}</p>
                  <div>
                    {item.locationUrl && (
                      <a
                        href={item.locationUrl}
                        className="text-white underline">
                        View Location
                      </a>
                    )}
                    {item.locationUrl && item.registerUrl && (
                      <>
                        <span className="px-1 text-white">|</span>
                        <a
                          href={item.registerUrl}
                          className="text-white underline">
                          Register Here
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-20">
                  <p className="text-2xl text-white">
                    <strong>{format(item.date, 'd MMM')}</strong>
                  </p>
                  <p className="text-2xl text-white">{format(item.date, 'y')}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };
  //#endregion

  return (
    <>
      <HtmlHead />
      <HeaderDefault />
      <main className="w-full overflow-hidden">
        <section className="relative bg-black py-20 md:min-h-screen">
          <div className="relative flex w-full max-w-7xl mx-auto p-12 z-10">
            <div className="flex-1 flex flex-col gap-12">
              <div className="pt-10">
                <p className="text-white text-xl md:text-3xl">Welcome To</p>
                <h1 className="text-white uppercase text-6xl md:text-8xl">
                  <strong className="text-7xl md:text-9xl">Utopia</strong>
                  <br />
                  Club
                </h1>
              </div>
              <div className="flex flex-col gap-4 pt-1/4">
                <ButtonDefault className="w-60">Mint Utopia Pass</ButtonDefault>
                <ButtonDefault className="w-60 hover:bg-utopia-blue focus:bg-utopia-blue">
                  About Utopia Club
                </ButtonDefault>
              </div>
            </div>
            <div className="flex-col gap-8 hidden md:flex">
              <div className="flex flex-col gap-4">
                <UpcomingEvents />
                <ButtonDefault className="block w-60 py-1 ml-auto">View Gallery</ButtonDefault>
              </div>
            </div>
          </div>
          <Image
            src="/masthead-a.jpeg"
            objectFit="cover"
            className="z-0"
            alt=""
            fill
          />
        </section>
        <section className="bg-black p-12 md:min-h-screen md:p-20">
          <div className="w-full mx-auto max-w-7xl flex flex-col gap-8">
            <h2 className="text-4xl font-bold text-white">Meet Utopia club</h2>
            <p className="text-xl text-white md:text-2xl">
              {`Utopia club is an exclusive close-knit community and foundation, a melting pot of web3
              enthusiasts and influential figures from various backgrounds: degens to investors,
              celebrities to entrepreneurs, and web2 to web3 professionals that connects every
              single entities in Utopia Club's network and ecosystem`}
            </p>
            <div className="relative aspect-video">
              <Image
                src="/images/utopia-ecosystem.png"
                alt=""
                objectFit="contain"
                fill
              />
            </div>
          </div>
        </section>
        <section className="relative md:min-h-screen">
          <div className="relative flex flex-col gap-12 z-10">
            <h2 className="text-4xl font-bold text-white text-center w-full max-w-7xl mx-auto p-12 pb-0 md:p-20 md:pb-0">
              Activities and Events
            </h2>
            <Carousel
              className="px-12"
              opts={{
                loop: true,
              }}>
              <CarouselContent>
                {eventHero.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/3 px-12 h-48">
                    <div className="relative aspect-video">
                      <Image
                        alt="Hero Event"
                        src={image.image}
                        // src={image}
                        fill
                        className="bg-black/10"
                        objectFit="contain"
                        onClick={() => handleEventDetailChange(image.id)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/*               
              <CarouselPrevious className="absolute left-10 z-10" />
              <CarouselNext className="absolute right-10 z-10" />
              */}
            </Carousel>
            {eventDetail && (
              <div className="flex gap-4 w-full max-w-7xl mx-auto p-12 pt-0 md:p-20 md:pt-0 md:gap-12">
                <div className="relative flex-1 aspect-square md:aspect-video">
                  <Image
                    src={eventDetail.images[0]?.path ?? ""}
                    alt={eventDetail.name}
                    fill
                    className="bg-slate-200 cursor-pointer"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <p className="font-bold text-white text-xl md:text-4xl">{eventDetail.name}</p>
                  <p className="text-xs text-white md:text-2xl">{eventDetail.description}</p>
                </div>
              </div>
            )}
          </div>
          <Image
            src="/images/bg-blur.png"
            objectFit="cover"
            className="z-0"
            alt=""
            fill
          />
        </section>
        <section className="bg-black flex justify-center p-12 md:hidden">
          <UpcomingEvents />
        </section>
        <section className="relative bg-black p-8 md:p-20">
          <div className="w-full max-w-7xl mx-auto">
            <div className="relative">
              <div className="flex-1 flex flex-col gap-8 relative z-10 pr-10">
                <h2 className="font-bold text-white text-4xl md:text-7xl">Utopia Foundation</h2>
                <p className="font-medium text-white text-xl md:text-3xl">
                  As a Foundation, Utopia provide support through services and products:
                </p>
              </div>
              <div className="absolute top-24 left-0 -right-40 -bottom-8 z-0">
                <Image
                  src="/images/logo-utopia-3d.png"
                  alt=""
                  fill
                  objectFit="contain"
                />
              </div>
              <div className="flex flex-col items-center gap-8 pt-12 md:flex-row">
                <div className="relative flex-1 aspect-video h-52">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                    <Image
                      src="/images/logo-verify.png"
                      width={450}
                      height={81}
                      alt=""
                    />
                  </div>
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/60 z-10"></div>
                  <Image
                    src="/images/bg-verify.png"
                    alt=""
                    fill
                    objectFit="cover"
                  />
                </div>
                <div className="relative flex-1 aspect-video h-52">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
                    <p className="text-3xl font-bold text-white">Utopia Organizer</p>
                  </div>
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30 z-10"></div>
                  <Image
                    src="/images/bg-blur.png"
                    alt=""
                    fill
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-black p-12 md:p-20">
          <div className="w-full max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white text-center">Our Network</h2>
            <div className="p-8">
              <p className="text-2xl text-white text-center pb-2">Associations</p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="relative aspect-video h-16">
                  <Image
                    src="/images/logo-asosiasi-kripto.png"
                    alt=""
                    objectFit="contain"
                    fill
                  />
                </div>
                <div className="relative aspect-video h-16">
                  <Image
                    src="/images/logo-crypto-asociation.png"
                    alt=""
                    objectFit="contain"
                    fill
                  />
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-2xl text-white text-center pb-2">Tech Devs</p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="relative aspect-video h-16">
                  <Image
                    src="/images/logo-parallax.png"
                    alt=""
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="relative aspect-video h-16">
                  <Image
                    src="/images/logo-zk.png"
                    alt=""
                    fill
                    objectFit="contain"
                  />
                </div>
              </div>
            </div>
            {/*
            <div className="grid grid-cols-2 place-items-center md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <div className="">
                <p className="text-lg font-semibold text-white">Supported By:</p>
              </div>
              {partners?.map((partner, index) => (
                <div
                  key={index}
                  className="relative h-20 w-full">
                  <Link
                    href={partner.description ?? "#"}
                    target="_blank">
                    <Image
                      className="object-contain"
                      src={partner.images[0]?.path ?? ""}
                      alt={`Logo ${partner.name}`}
                      fill
                    />
                  </Link>
                </div>
              ))}
            </div>
            */}
          </div>
        </section>
        <section className="bg-black p-12 md:p-20">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
            <h2 className="text-4xl font-bold text-white text-center">Be a Part of Utopia Club</h2>
            {gallerySuccessFetch && (
              <div className="grid gap-20 md:grid-cols-3">
                {galleryData.map((gallery, index) => (
                  <div className="relative h-500px overflow-hidden group" key={index}>
                    <Image
                      src={gallery.image.path}
                      alt={gallery.name}
                      fill
                    />
                    <div className="absolute top-0 left-0 right-0 bottom-0 p-8 text-center bg-black/40 transition translate-y-full group-hover:translate-y-0">
                      <p className="text-4xl font-bold text-white">{gallery.name}</p>
                      <p className="text-3xl text-white pt-6">
                        {
                          gallery.description
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <footer className="bg-black p-8">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          <div className="grow basis-full order-2 md:order-1 md:basis-auto">
            <div className="relative aspect-video md:h-16">
              <Image
                src="/images/logo-utopia-full.png"
                alt=""
                fill
                objectFit="contain"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 order-1 md:order-2">
            <div className="flex flex-wrap items-center justify-center gap-8 w-full mx-auto max-w-7xl">
              <a
                href="x.com"
                target="_blank"
                className="block">
                <Image
                  src="/images/social/social-x-white.png"
                  alt="twitter icon"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="discord.com"
                target="_blank"
                className="block">
                <Image
                  src="/images/social/social-discord-white.png"
                  alt="discord icon"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="instagram.com"
                target="_blank"
                className="block">
                <Image
                  src="/images/social/social-ig-white.png"
                  alt="instagram icon"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="whatsapp.com"
                target="_blank"
                className="block">
                <Image
                  src="/images/social/social-wa-white.png"
                  alt="whatsapp icon"
                  width={30}
                  height={30}
                />
              </a>
              <div className="relative text-center basis-full md:basis-auto">
                <ButtonDefault className="w-44 h-12">Connect With Us</ButtonDefault>
              </div>
            </div>
            <p className="text-sm font-bold text-white text-right hidden md:block">
              COPYRIGHT UTOPIA FAMILY © ALL RIGHTS RESERVED 2023
            </p>
          </div>
          <p className="text-sm font-bold text-white text-right order-3 block md:hidden">
            COPYRIGHT UTOPIA FAMILY © ALL RIGHTS RESERVED 2023
          </p>
        </div>
      </footer>
    </>
  );
}
