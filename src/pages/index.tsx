import Head from "next/head";
import Image from "next/image";
import React, { type ReactNode, useEffect, useState } from "react";

import { api } from "~/utils/api";
import { type EventWithImages } from "~/server/api/routers/event";

import { format } from "date-fns";

import HeaderDefault from "~/components/HeaderDefault";
import ButtonDefault from "~/components/button/button-default";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import type { GalleryWithImage } from "~/server/api/routers/news";

type eventWithImagesAndId = {
  image: string;
  id: number;
};

export default function Home() {
  const [contactFormVisible, setContactFormVisible] = useState(false);

  const { data: events } = api.event.getFront.useQuery({
    limit: 1000,
    page: 1,
  });
  const [eventHero, setEventHero] = useState<eventWithImagesAndId[][]>();
  const [newsHero, setNewsHero] = useState<eventWithImagesAndId[][]>();
  const [eventDetail, setEventDetail] = useState<EventWithImages | null>(null);
  const [dataPerColumn, setDataPerColumn] = useState(1);
  const [windowWidth, setWindowWidth] = useState(0);
  const isPhoneSize = () => window.innerWidth <= 768;

  useEffect(() => {
    // Define a function to handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (isPhoneSize()) {
        setDataPerColumn(2);
      } else {
        setDataPerColumn(4); // Or set to any other default value you prefer
      }
    };

    document.addEventListener("readystatechange", handleResize);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data: news } = api.news.getFront.useQuery();
  const [galleryDataDetail, setGalleryDataDetail] =
    useState<GalleryWithImage | null>();

  const { data: partnerGroups = [] } = api.partner.getPartnerGroups.useQuery();

  useEffect(() => {
    let tempArray: eventWithImagesAndId[] = [];
    const eventImages: eventWithImagesAndId[][] =
      events?.data.reduce(
        (carry: eventWithImagesAndId[][], event, index, array) => {
          event.images.forEach((image) => {
            tempArray.push({
              image: image.path,
              id: event.id,
            });

            if (tempArray.length > 7) {
              carry.push([...tempArray]);
              tempArray = [];
            }

            // If this is the last item, push any remaining items in tempArray to carry
            if (index === array.length - 1 && tempArray.length > 0) {
              carry.push([...tempArray]);
            }
          });
          return carry;
        },
        [],
      ) ?? [];

    setEventHero(eventImages);
  }, [events]);

  useEffect(() => {
    let tempArray: eventWithImagesAndId[] = [];
    const newsImages: eventWithImagesAndId[][] =
      news?.reduce((carry: eventWithImagesAndId[][], item, index, array) => {
        tempArray.push({
          image: item.image.path,
          id: item.id,
        });

        if (tempArray.length > 7) {
          carry.push([...tempArray]);
          tempArray = [];
        }

        // If this is the last item, push any remaining items in tempArray to carry
        if (index === array.length - 1 && tempArray.length > 0) {
          carry.push([...tempArray]);
        }

        return carry;
      }, []) ?? [];

    setNewsHero(newsImages);
  }, [news]);

  const handleEventDetailChange = (id: number) => {
    if (!events) return;
    const event = events.data.find((event) => event.id === id);
    if (!event) return;
    setEventDetail(event);
  };

  const handleNewsDetailChange = (id: number) => {
    if (!news) return;
    const item = news.find((event) => event.id === id);
    if (!item) return;
    setGalleryDataDetail(item);
  };

  //#region components
  const HtmlHead = (): ReactNode => {
    return (
      <Head>
        <title>UTOPIA - NFT</title>
      </Head>
    );
  };

  const UpcomingEvents = (): ReactNode => {
    const { data, isSuccess } = api.upcomingEvent.getFront.useQuery({
      limit: 10,
      page: 1,
    });

    return (
      <div className="rounded-3xl bg-white/20 w-96 overflow-hidden">
        <div className="bg-white/20 p-3">
          <h2 className="text-2xl text-center text-white font-semibold">
            Upcoming Events
          </h2>
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
                        target="_blank"
                        className="text-white underline">
                        View Location
                      </a>
                    )}
                    {item.locationUrl && item.registerUrl && (
                      <>
                        <span className="px-1 text-white">|</span>
                        <a
                          href={item.registerUrl}
                          target="_blank"
                          className="text-white underline">
                          Register Here
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="w-20">
                  <p className="text-2xl text-white">
                    <strong>{format(item.date, "d MMM")}</strong>
                  </p>
                  <p className="text-2xl text-white">
                    {format(item.date, "y")}
                  </p>
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
      <HeaderDefault
        contactFormVisible={contactFormVisible}
        setContactFormVisible={setContactFormVisible}
      />
      <main className="w-full overflow-hidden bg-black scroll-smooth">
        <section className="fixed top-0 bottom-0 left-0 right-0 z-10 bg-black py-20 min-h-screen">
          <div className="relative flex w-full mx-auto p-20 pt-12 z-10">
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
                <a
                  href="https://opensea.io/collection/utopia-club"
                  target="_blank">
                  <ButtonDefault className="w-60">
                    Mint Utopia Pass
                  </ButtonDefault>
                </a>
                <ButtonDefault className="w-60 hover:bg-utopia-blue focus:bg-utopia-blue">
                  About Utopia Club
                </ButtonDefault>
              </div>
            </div>
            <div className="flex-col gap-8 hidden md:flex">
              <div className="flex flex-col gap-4">
                <UpcomingEvents />
                {/*
                <ButtonDefault className="block w-60 py-1 ml-auto">
                  View News
                </ButtonDefault>
                */}
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
        <section className="h-screen w-full"></section>
        <section className="relative z-10 bg-[#00151E]">
          <section className="flex justify-center bg-black pt-8">
            <img
              src="/images/top-line-leftest.png"
              alt=""
              className="h-40 md:flex-1"
            />
            <img
              src="/images/top-line-left.png"
              alt=""
              className="h-40"
            />
            <img
              src="/images/top-line-right.png"
              alt=""
              className="h-40 hidden md:block"
            />
            <img
              src="/images/top-line-rightest.png"
              alt=""
              className="flex-1 h-40 hidden md:block"
            />
          </section>
          <section className="relative z-10 -mt-28 p-8 pt-16 md:p-20 md:pt-36">
            <div className="w-full mx-auto flex flex-col gap-8">
              <h2 className="text-[32px] md:text-[40px] font-bold text-white">
                Meet Utopia club
              </h2>
              <p className="text-white text-[16px] md:text-[24px]">
                Utopia club is an exclusive close-knit community and foundation,
                a melting pot of web3 enthusiasts and influential figures from
                various backgrounds: degens to investors, celebrities to
                entrepreneurs, and web2 to web3 professionals that connects
                every single entities in Utopia Club&apos;s network and
                ecosystem
              </p>
            </div>
          </section>
          <section className="flex justify-center p-8 md:hidden">
            <UpcomingEvents />
          </section>
          {eventHero && (
            <section className="relative z-10">
              <div className="relative flex flex-col gap-2 z-10">
                <h2 className="text-4xl font-bold text-white text-center mx-auto p-12 pt-12 pb-0 md:p-20 md:pb-0">
                  Activities and Events
                </h2>
                <Carousel
                  className="p-12"
                  opts={{
                    loop: false,
                  }}>
                  <CarouselContent>
                    {eventHero.map((image, index) => (
                      <CarouselItem
                        key={index}
                        className="items-center justify-center pl-0">
                        <div
                          className={`grid grid-cols-${Math.min(Math.ceil(image.length / 2), dataPerColumn)} gap-4`}
                          style={{
                            paddingLeft:
                              ((windowWidth / dataPerColumn) *
                                (dataPerColumn -
                                  Math.min(
                                    Math.ceil(image.length / 2),
                                    dataPerColumn,
                                  ))) /
                                2 +
                              "px",
                            paddingRight:
                              ((windowWidth / dataPerColumn) *
                                (dataPerColumn -
                                  Math.min(
                                    Math.ceil(image.length / 2),
                                    dataPerColumn,
                                  ))) /
                                2 +
                              "px",
                          }}>
                          {image.map((img, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center aspect-square">
                              <button
                                className="relative h-full w-full"
                                onClick={() => handleEventDetailChange(img.id)}>
                                <Image
                                  alt="Event"
                                  src={img.image}
                                  className="bg-slate-200 object-cover"
                                  loading="eager"
                                  fill
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex absolute left-10 z-10" />
                  <CarouselNext className="hidden md:flex absolute right-10 z-10" />
                  <div
                    className={`
                  absolute z-10 top-0 bottom-0 left-6 right-0 rounded-tl-[40px] rounded-bl-[40px] bg-black/60 transition backdrop-blur
                  ${eventDetail ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="relative h-full w-full p-12 pt-16">
                      <button
                        className="absolute top-6 left-6 flex items-center justify-center h-12 w-12"
                        onClick={() => setEventDetail(null)}>
                        <span className="text-white text-[42px]">&times;</span>
                      </button>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-12 h-full w-full overflow-auto">
                        <img
                          src={eventDetail?.images[0]?.path ?? ""}
                          alt=""
                          className="h-40 w-40 md:h-[564px] md:w-[564px] object-contain rounded overflow-hidden bg-slate-300 shrink-0"
                        />
                        <div className="flex flex-col gap-8">
                          <p className="text-white font-bold text-[28px] md:text-[42px]">
                            {eventDetail?.name}
                          </p>
                          <p className="text-white text-[12px] md:text-[24px]">
                            {eventDetail?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel>
              </div>
            </section>
          )}
          {newsHero?.length && (
            <section className="relative z-10">
              <div className="relative flex flex-col gap-2 z-10">
                <h2 className="text-4xl font-bold text-white text-center mx-auto p-12 pt-12 pb-0 md:p-20 md:pb-0">
                  News
                </h2>
                <Carousel
                  className="p-12"
                  opts={{
                    loop: false,
                  }}>
                  <CarouselContent>
                    {newsHero.map((news, index) => (
                      <CarouselItem
                        key={index}
                        className={`items-center`}>
                        <div
                          className={`grid grid-cols-${Math.min(Math.ceil(news.length / 2), dataPerColumn)} gap-4`}
                          style={{
                            paddingLeft:
                              ((windowWidth / dataPerColumn) *
                                (dataPerColumn -
                                  Math.min(
                                    Math.ceil(news.length / 2),
                                    dataPerColumn,
                                  ))) /
                                2 +
                              "px",
                            paddingRight:
                              ((windowWidth / dataPerColumn) *
                                (dataPerColumn -
                                  Math.min(
                                    Math.ceil(news.length / 2),
                                    dataPerColumn,
                                  ))) /
                                2 +
                              "px",
                          }}>
                          {news.map((img, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-center aspect-square">
                              <button
                                className="relative h-full w-full"
                                onClick={() => handleNewsDetailChange(img.id)}>
                                <Image
                                  alt="Event"
                                  src={img.image}
                                  className="bg-slate-200 object-cover"
                                  loading="eager"
                                  fill
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden md:flex absolute left-10 z-10" />
                  <CarouselNext className="hidden md:flex absolute right-10 z-10" />
                  <div
                    className={`
                  absolute z-10 top-0 bottom-0 left-6 right-0 rounded-tl-[40px] rounded-bl-[40px] bg-black/60 transition backdrop-blur
                  ${galleryDataDetail ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="relative h-full w-full p-12 pt-16">
                      <button
                        className="absolute top-6 left-6 flex items-center justify-center h-12 w-12"
                        onClick={() => setGalleryDataDetail(null)}>
                        <span className="text-white text-[42px]">&times;</span>
                      </button>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-12 h-full w-full overflow-auto">
                        <img
                          src={galleryDataDetail?.image.path ?? ""}
                          alt=""
                          className="h-40 w-40 md:h-[574px] md:w-[574px] object-contain rounded overflow-hidden bg-slate-300 shrink-0"
                        />
                        <div className="flex flex-col gap-8">
                          <p className="text-white font-bold text-[28px] md:text-[42px]">
                            {galleryDataDetail?.name}
                          </p>
                          <div className="flex flex-col gap-4">
                            <p className="text-white text-[12px] md:text-[24px]">
                              {galleryDataDetail?.description}
                            </p>
                            {galleryDataDetail?.url && (
                              <a
                                className="text-[12px] md:text-[16px] text-utopia-blue"
                                href={galleryDataDetail.url}
                                target="_blank">
                                Read More
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Carousel>
              </div>
            </section>
          )}
          <section className="relative z-10 p-12 pt-28 md:p-10">
            <div className="w-full mx-auto">
              <h2 className="text-4xl font-bold text-white text-center">
                Our Network
              </h2>
              {partnerGroups.map((partnerGroup, index) => (
                <div
                  className="p-8"
                  key={index}>
                  <p className="text-2xl text-white text-center pb-2">
                    {partnerGroup.name}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    {partnerGroup.partners.map((partner, index) => (
                      <Link
                        href={partner.description ?? "#"}
                        target="_blank"
                        className="relative aspect-video h-16"
                        key={index}>
                        <Image
                          src={partner.images[0]?.path ?? ""}
                          alt=""
                          objectFit="contain"
                          fill
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="relative flex flex-col md:flex-row items-center gap-8 md:gap-3 p-8 pb-28 md:p-20">
            <div className="relative grow w-full mx-auto flex flex-col gap-12">
              <div className="relative z-10 flex flex-col justify-center gap-14">
                <h2 className="text-[32px] md:text-[42px] lg:text-[64px] xl:text-[96px] font-bold text-white text-center md:text-left leading-tight">
                  Be a Part of <br className="hidden md:inline-block" />
                  <strong>Utopia Club</strong>
                </h2>
                <div className="flex flex-col gap-4 pt-1/4">
                  <a
                    className="mx-auto md:mx-0"
                    href="https://opensea.io/collection/utopia-club"
                    target="_blank">
                    <ButtonDefault className="w-80 h-12">
                      Mint Utopia Pass
                    </ButtonDefault>
                  </a>
                  <ButtonDefault
                    className="w-80 h-12 hover:bg-utopia-blue focus:bg-utopia-blue mx-auto md:mx-0"
                    onClick={() => setContactFormVisible(true)}>
                    Be Utopia Network
                  </ButtonDefault>
                  <a
                    href="#welcome"
                    className="mx-auto md:mx-0">
                    <ButtonDefault className="w-80 h-12 hover:bg-utopia-blue focus:bg-utopia-blue mx-auto md:mx-0">
                      Join Connecting Community
                    </ButtonDefault>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative aspect-square w-full h-full md:w-auto md:h-auto md:absolute md:-right-32 md:top-0 md:bottom-0">
              <div className="relative h-full w-full">
                <Image
                  src="/images/logo-utopia-3d.png"
                  alt=""
                  className="object-contain"
                  fill
                />
              </div>
            </div>
          </section>
          <section>
            <div className="flex md:hidden flex-col gap-4 order-1 md:order-2">
              <div className="flex flex-wrap items-center justify-center gap-8 w-full mx-auto">
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
                  <ButtonDefault
                    className="w-44 h-12"
                    onClick={() => setContactFormVisible(true)}>
                    Connect With Us
                  </ButtonDefault>
                </div>
              </div>
              <p className="text-sm font-bold text-white text-right hidden md:block">
                COPYRIGHT UTOPIA FAMILY © ALL RIGHTS RESERVED 2023
              </p>
            </div>
          </section>
          <section className="flex justify-center bg-black">
            <img
              src="/images/bottom-line-leftest.png"
              alt=""
              className="h-40 hidden md:block md:flex-1"
            />
            <img
              src="/images/bottom-line-left.png"
              alt=""
              className="h-40 hidden md:block"
            />
            <img
              src="/images/bottom-line-right.png"
              alt=""
              className="h-40"
            />
            <img
              src="/images/bottom-line-rightest.png"
              alt=""
              className="h-40 md:flex-1"
            />
          </section>
          <div className="relative bg-black w-full">
            <div className="mx-auto flex flex-wrap items-center gap-2 p-8 pt-0 md:px-20">
              <div className="grow basis-full order-2 md:order-1 md:basis-auto">
                <div className="relative aspect-video w-[190px] mx-auto md:mx-0">
                  <Image
                    src="/images/logo-utopia-full.png"
                    alt=""
                    fill
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <div className="hidden md:flex flex-col gap-4 order-1 md:order-2">
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
                    <ButtonDefault
                      className="w-44 h-12"
                      onClick={() => setContactFormVisible(true)}>
                      Connect With Us
                    </ButtonDefault>
                  </div>
                </div>
                <p className="text-sm font-bold text-white text-right hidden md:block">
                  COPYRIGHT UTOPIA FAMILY © ALL RIGHTS RESERVED 2023
                </p>
              </div>
              <p className="text-sm font-normal text-white text-center w-full md:text-right order-3 block md:hidden">
                COPYRIGHT UTOPIA FAMILY © ALL RIGHTS RESERVED 2023
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
