import React, {useState, useEffect} from 'react';
import {animate, motion, useMotionValue} from "framer-motion";
import useMeasure from "react-use-measure";
import Card from "@/components/Card";

    export default function Home(){
        const docHeadshots = [
            "/Docs_headshots/img1.png",
            "/Docs_headshots/img2.png",
            "/Docs_headshots/img3.png",
            "/Docs_headshots/img4.png",
            "/Docs_headshots/img5.png",
            "/Docs_headshots/img6.png",
            "/Docs_headshots/img7.png",
            "/Docs_headshots/img8.png",
        ];


    return <main className="py-8">
        <div className="">
            {[...docHeadshots].map((item, idx) => (
                <Card />
            ))}
        </div>
    </main>; 

}