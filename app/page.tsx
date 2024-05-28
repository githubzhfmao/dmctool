import Image from "next/image"
import web3tools from "../public/web3tools.png";
import dmc from "../public/dmc.png";

export default function IndexPage() {
  return (
    <section className="scroll-auto">
      <div className="flex h-screen justify-center items-center gap-60 sm:container">
        <div>
          <div className="text-3xl font-black text-white">Let tools change your life</div>
          <div className="text-3xl font-black text-[#F7B34E] mt-6">In the Web3 world</div>
        </div>
        <Image src={web3tools} width={450} alt={""}/>
      </div>
      <div className="flex flex-col items-center justify-center gap-40 h-screen text-6xl font-black text-white">
          <div className="flex flex-col items-center justify-center ">
            <div>WE ONLY WORK ON <span className="text-[#F7B34E] ">WEB3</span></div>
            <div>AND CREATE TOOLS FOR</div>
            <div className="text-[#F7B34E] ">BLOCK CHAIN</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="text-3xl mr-10">OUR SPONSOR</div>
            <div className="flex justify-center bg-[#212121] px-5 py-3 rounded-lg"><Image src={dmc} width={200} alt=""/></div>
          </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 h-screen text-3xl font-black text-[#F7B34E]">
            <div> TOOLS DAO A GROUP OF DEVELOPERS WHO</div>
            <div>LOVE WEB3 TECHNOLOGY AND EMBRACE</div>
            <div>WEB3, SO THAT WEB3 CAN BRING MORE</div>
            <div>BENEFITS AND CONVENIENCE TO PEOPLE</div>
          </div>
    </section>
  )
}
