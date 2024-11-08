import React from 'react';
import ServiceCard from '@/components/ServiceCard';

export default function Services() {
    const services = [
        {
            title: 'Batteries and Chargers',
            items: ['Devices', 'Cordless Phones', 'Wheelchairs', 'Scooters', 'Tools', 'Golf Carts', 'Home and Garden'],
        },
        {
            title: 'Cables and Connectors',
            items: ['Audio', 'Video', 'Data'],
        },
        {
            title: 'Wireless Plans',
            items: ['H2O Wireless', 'Xfinity Prepaid Wireless'],
        },
        {
            title: 'Repair Services',
            items: ['iPhones', 'iPads', 'Select Android Devices'],
        },
        {
            title: 'Computer Services',
            items: ['Hardware and Software Solutions', 'Small Electronics Repairs'],
        },
        {
            title: 'Electronics Components and Tools',
            items: ['For DIYers and Hobbyists'],
        },
    ];

    return (
        <div className="page-container">
            <div className="flex-container">
                <div className="page-title-container">
                    <h2 className="page-title">Services</h2>
                </div>
                <div className="section-title-container">
                    <p className="section-title">We Solve Problems!</p>
                </div>
            </div>
            <p className="body-text">
                At Batteries Etc., we offer a comprehensive range of services to meet all your tech needs. From batteries and chargers to cables and connectors, wireless plans, repair services, computer solutions, and electronics components, we&apos;ve got you covered.
            </p>
            <p className="body-text">
                Our battery and charger services cater to a variety of devices, including cordless phones, wheelchairs, scooters, tools, golf carts, and home and garden equipment. We also stock a wide range of cables and connectors for audio, video, and data applications.
            </p>
            <p className="body-text">
                For wireless connectivity, we&apos;re an H2O Wireless dealer, offering affordable monthly, multiline, multimonth, and yearly plans for smartphones and flip phones. Additionally, we offer Xfinity prepaid wireless plans with a low monthly price of $45, with no hidden fees or contracts.
            </p>
            <p className="body-text">
                Our repair services include iPhone and iPad repairs, as well as select Android device repairs. Our computer services encompass a full range of hardware and software solutions, and we also perform small electronics repairs.
            </p>
            <p className="body-text">
                For the DIYer or hobbyist, we stock a variety of electronics components and tools to help you get the job done right.
            </p>
            <p className="body-text text-center highlight-text">
                This list is not an exhaustive list of supported platforms and services by Batteries Etc.
            </p>
            <div className="flex-container items-start w-full">
                {/* Services list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={index} title={service.title} items={service.items} />
                    ))}
                </div>
            </div>
        </div>
    );
}
