import Image from "next/image";

export default function Home() {
  return (
    (<div className="page-container">
      <div className="flex-container">
        <div className="page-title-container">
          <h2 className="page-title">Serving The Nature Coast</h2>
        </div>
        <div className="section-title-container">
          <p className="section-title">You Can Find It Here!</p>
        </div>
      </div>
      <div className="w-100 md:w-1/3  float-right p-6 m-0">
          <Image
            // replace with your image path
            src="/overload.jpg"
            alt="tech overload"
            width={100}
            height={100}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto"
            }} />
        </div>
      <div className="">
        <p className="body-text">
          Located at 3850 E Gulf to Lake Highway, Suite 11 in Inverness, FL, we&apos;re open Monday through Saturday from 10am to 5pm. Give us a call at <span className="highlight-text">352-344-1962</span> to reach our friendly team.
        </p>
        <p className="body-text">
          At Batteries Etc., we&apos;re more than just a battery store. We&apos;re your source for a wide range of high-tech gadgets that you wont&apos; find anywhere else. From batteries for devices, cordless phones, wheelchairs, scooters, tools, golf carts, home and garden, to a variety of cables and connectors for audio, video, and data, we&apos;ve got you covered.
        </p>
        <div className="w-100 md:w-1/3   float-left p-6 m-0">
          <Image
            // replace with your image path
            src="/h2o.png"
            alt="H2O Wireless"
            width={100}
            height={100}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto"
            }} />
        </div>
        <p className="body-text">
          We&apos;re also an H2O Wireless dealer, offering great affordable monthly, multiline, multimonth, and yearly plans for smartphones and flip phones. Plus, we offer Xfinity prepaid wireless with a low monthly price of $45, with no hidden fees or contracts.
        </p>
        <div className="w-100 md:w-1/3   float-right p-6 m-0">
          <Image
            // replace with your image path
            src="/cracked.jpg"
            alt="Phone Repairs"
            width={100}
            height={100}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto"
            }} />
        </div>
        <p className="body-text">
          In addition, we also provide repair services for iPhones, iPads, and select Android devices. Our computer services include a full range of hardware and software solutions, and we also perform small electronics repairs.
        </p>
        <div className="w-100 md:w-1/3   float-left p-6 m-0">
          <Image
            // replace with your image path
            src="/techteen.jpg"
            alt="Phone Repairs"
            width={100}
            height={100}
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto"
            }} />
        </div>
        <p className="body-text">
          For the DIYer or hobbyist, we stock a variety of electronics components and tools to help you get the job done right. So whether you&apos;re looking for batteries, cables, connectors, wireless plans, repairs, or components, Batteries Etc. is your go-to destination. Come visit us today and see what we have to offer!
        </p>
      </div>
    </div>)
  );
}
