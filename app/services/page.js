import React from 'react';
import { services } from '@/data/config';
import ServiceCard from '@/components/ServiceCard';
import Carousel from '@/components/Carousel';

export default function Services() {
    return (
        <div className="page-container">
            <div className="flex-container">
                <div className="page-title-container">
                    <h2 className="page-title">Services</h2>
                </div>
                <div className="section-title-container">
                    <p className="section-title">LMYNL provides a wide range of cost-effective and innovative technology solutions.</p>
                </div>
            </div>
            <p className="body-text">
                At our company, we specialize in designing and building a wide range of digital projects that help businesses thrive in today&apos;s online world. From brand websites to e-commerce platforms, we have the expertise to bring your vision to life.
            </p>
            <p className="body-text">
                Our team excels in building operations infrastructure, automating processes, and integrating systems to streamline your business operations. We also specialize in creating data APIs that enable seamless data exchange between different applications.
            </p>
            <p className="body-text">
                Looking to drive more traffic and conversions? Our digital advertising landing pages are optimized for maximum impact and results. Plus, our KPI dashboards help you track your business performance in real-time, giving you valuable insights to make informed decisions.
            </p>
            <p className="body-text">
                No matter what type of project you have in mind, we have the skills and experience to deliver exceptional results. Contact us today to learn more about how we can help your business succeed online.
            </p>
            <p className="body-text text-center highlight-text">
                This list is not an exhaustive list of supported platforms and services by LMYNL
            </p>
            <div className="flex-container items-start w-full">
                {/* Services list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} title={service.title} items={service.items} />
                    ))}
                <div className=" rounded-lg shadow-lg border border-gray-200 p-6 m-4 bg-zinc-900 bg-opacity-50 border-2 border-zinc-300 shadow-2xl flex items-center">
                <p className="text-xl p-0 m-0 text-justify">
                    This list is not representative of the totality of skills and experience <span className="text-amber-300">LMYNL</span> offers. Instead, it merely provides a sense of the wide solutions coverage available. Many of these services are value-added bonuses as a consequence of working towards your vision.
                </p>
                </div>

                </div>
            </div>
        </div>
    );
}