'use client';
import ContactForm from '@/components/contactform';

export default function Contact() {
    return (
        <div className="page-container">
            <div className="flex-container">
                <div className="page-title-container">
                    <h2 className="page-title">
                        Contact
                    </h2>
                </div>
                <div className="section-title-container">
                    <p className="section-title">Let&apos;s talk about your vision.</p>
                </div>
            </div>
            <div className="max-w-2xl mx-auto">
                <ContactForm />
            </div>
        </div>
    );
}