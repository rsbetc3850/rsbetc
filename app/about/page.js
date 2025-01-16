import Image from "next/image";
export default function About() {
    return (
        (<div className="page-container">
            <div className="flex-container">
                <div className="page-title-container">
                    <h2 className="page-title">About Us</h2>
                </div>
                <div className="section-title-container">
                    <p className="section-title">Proudly Serving  Inverness</p>
                </div>
            </div>
            <p className="body-text">
                Located at 3850 E Gulf to Lake Highway in Inverness, FL, Batteries Etc has been a trusted provider of electronics and technology solutions for over 40 years. Our store, with a phone number of 352-344-1962, is dedicated to serving the local community with a wide range of products and services.
            </p>
            <p className="body-text">
                Our team of experts is committed to helping customers find the right solutions for their needs, whether it&apos;s a new smartphone, a home security system, or a simple battery replacement. We pride ourselves on our knowledge and our ability to provide personalized service to each and every customer.
            </p>
            <div className="w-1/2 md:w-1/3  float-right p-6 m-0">
                <Image
                    // replace with your image path
                    src="/invernesspark.jpg"
                    alt="Liberty Park Inverness"
                    width={100}
                    height={100}
                    sizes="100vw"
                    style={{
                        width: "100%",
                        height: "auto"
                    }} />
            </div>
            <p className="body-text">
                At Batteries Etc, we believe that technology should be accessible to everyone. That&apos;s why we offer a variety of products at competitive prices, and we&apos;re always looking for new ways to make technology more affordable and accessible.
            </p>
            <div className="w-1/2 md:w-1/3  float-left p-6 m-0">
                <Image
                    // replace with your image path
                    src="/3dprintclass.jpg"
                    alt="3d Printer Class"
                    width={100}
                    height={100}
                    sizes="100vw"
                    style={{
                        width: "100%",
                        height: "auto"
                    }} />
            </div>
            <p className="body-text">
                We&apos;re more than just a store - wer&apos;e a community resource. We host workshops and events to help customers learn about the latest technology trends and how to use them to improve their lives. And wer&apos;e always here to answer questions and provide support, whether its&apos; in-store, over the phone, or on social media.
            </p>
            <p className="body-text">
                So if you&apos;re looking for a trusted provider of electronics and technology solutions, look no further than Batteries Etc. We&apos;re here to help you navigate the ever-changing landscape of technology, and we&apos;re committed to providing exceptional service and value to our customers.
            </p>
        </div>)
    );
}
