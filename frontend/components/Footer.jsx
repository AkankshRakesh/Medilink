import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import React from "react";

export const Footer = () => {
  return (
    <div className="h-screen flex items-center mx-auto justify-between w-full px-40">
      <ArrowLeftCircleIcon />
      <div className="flex flex-col max-w-xl  min-w-lg items-center border-t-8 border-slate-950 border px-4 rounded-t-xl relative pt-28">
        <img src="https://picsum.photos/200" alt="" className="w-32 rounded-full absolute -top-14"/>
        <p>
          The biggest benefit of HubSpot is that all your data lives in it, you see the same
          customer information as the sales team and vice versa. It gives us a new level of
          confidence.
        </p>
        <div clas>
          <p>John Doe</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>
      <ArrowRightCircleIcon />
    </div>
  );
};
