import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, usePathname } from 'next/navigation';

const roles = ['CEO', 'CTO', 'Manager', 'Developer', 'Designer', 'Marketing', 'Sales', 'Other'];
const sources = ['Search Engine', 'Social Media', 'Referral', 'Advertisement', 'Conference', 'Other'];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    otherRole: '',
    bestTimeToContact: '',
    howDidYouHearAboutUs: '',
    otherSource: '',
    optIn: false,
    subject: '',
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();
  const pathname = usePathname();


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      phone: value
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email && !formData.phone) errors.contact = 'Either email or phone is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) errors.phone = 'Phone number is invalid';
    if (formData.role === 'Other' && !formData.otherRole) errors.otherRole = 'Please specify your role';
    if (formData.howDidYouHearAboutUs === 'Other' && !formData.otherSource) errors.otherSource = 'Please specify how you heard about us';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Form submitted successfully!', {
          autoClose: 2000,
          onClose: () => router.push('/'), // Redirect to home page when toast is closed
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          role: '',
          otherRole: '',
          bestTimeToContact: '',
          howDidYouHearAboutUs: '',
          otherSource: '',
          optIn: false,
          subject: '',
        });
      } else {
        toast.error('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  const customDropdownStyle = {
    backgroundColor: '#18181b', // bg-zinc-900
    color: '#e4e4e7', // text-zinc-200
    border: '1px solid #3f3f46', // border-zinc-700
  };

  const customFlagStyle = {
    backgroundColor: '#18181b40', // bg-zinc-900
  };
  return (
    <div className="flex flex-col items-center ">
      <h2 className="text-lg font-semibold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] text-zinc-100 mb-4 capitalize">Please use the following form to contact us</h2>
      <form onSubmit={handleSubmit} className="backdrop-blur-md space-y-4 border-2 border-zinc-200 mb-8 p-4 shadow-lg rounded-lg bg-zinc-900 bg-opacity-25">
        <div className="mt-2">
          <label htmlFor="name" className="block text-sm font-medium text-zinc-100">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
        </div>
        <div className="mt-2">
          <label htmlFor="company" className="block text-sm font-medium text-zinc-100">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
          />
        </div>
        <div className="mt-2">
          <label htmlFor="role" className="block text-sm font-medium text-zinc-100">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {formData.role === 'Other' && (
            <input
              type="text"
              name="otherRole"
              value={formData.otherRole}
              onChange={handleChange}
              placeholder="Please specify your role"
              className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
            />
          )}
          {errors.otherRole && <p className="text-red-500 text-xs italic">{errors.otherRole}</p>}
        </div>
        <div className="mt-2">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-100">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div className="mt-2">
          <label htmlFor="phone" className="mt-4 block text-sm font-medium text-zinc-100">Phone</label>
          <PhoneInput
            country={'us'}
            value={formData.phone}
            onChange={handlePhoneChange}
            dropdownStyle={customDropdownStyle}
            buttonStyle={customFlagStyle}
            inputStyle={{
              width: '100%',
              backgroundColor: '#18181b40',
              color: '#e4e4e7',
              border: '1px solid #3f3f46',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              paddingLeft: '3rem',
            }}
            containerClass="w-full"
            dropdownClass="custom-phone-dropdown"
            inputProps={{
              name: 'phone',
              required: true,
              className: 'focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50'
            }}
          />
          {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-zinc-100">Best Time to Contact</label>
          <div className="mt-2 space-x-4">
            {['Morning', 'Afternoon', 'Evening', 'Any'].map(time => (
              <label key={time} className="inline-flex items-center">
                <input
                  type="radio"
                  name="bestTimeToContact"
                  value={time}
                  checked={formData.bestTimeToContact === time}
                  onChange={handleChange}
                  className="form-radio text-yellow-600"
                />
                <span className="ml-2 text-zinc-100">{time}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-2">
          <label htmlFor="howDidYouHearAboutUs" className="block text-sm font-medium text-zinc-100">How Did You Hear About Us?</label>
          <select
            id="howDidYouHearAboutUs"
            name="howDidYouHearAboutUs"
            value={formData.howDidYouHearAboutUs}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
          >
            <option value="">Select an option</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
          {formData.howDidYouHearAboutUs === 'Other' && (
            <input
              type="text"
              name="otherSource"
              value={formData.otherSource}
              onChange={handleChange}
              placeholder="Please specify how you heard about us"
              className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
            />
          )}
          {errors.otherSource && <p className="text-red-500 text-xs italic">{errors.otherSource}</p>}
        </div>
        <div className="mt-2">
          <label htmlFor="subject" className="block text-sm font-medium text-zinc-100">Subject</label>
            <textarea
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50 bg-zinc-700 text-zinc-100 bg-opacity-25"
              rows="4" // Add this line to set the number of rows for the textarea
            />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="optIn"
            name="optIn"
            checked={formData.optIn}
            onChange={handleChange}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label htmlFor="optIn" className="ml-2 block text-sm text-zinc-100">
            Opt-in to receive news and alerts
          </label>
        </div>
        <div className="mt-2">
          <button type="submit" className="w-full flex justify-center py-2 px-4 border-2 border-yellow-300 rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 bg-opacity-50 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
      <style jsx global>{`
        .react-tel-input .country-list {
          background-color: #18181b !important;
          color: #e4e4e7 !important;
        }
        .react-tel-input .country-list .country:hover,
        .react-tel-input .country-list .country.highlight {
          background-color: #27272a !important;
          color: #ffffff !important;
        }
        .react-tel-input .selected-flag {
          background-color: #18181b !important;
        }
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag:focus {
          background-color: #27272a !important;
        }
        .react-tel-input .flag-dropdown.open {
          background-color: #18181b !important;
        }
      `}</style>
    </div>
  );
}
