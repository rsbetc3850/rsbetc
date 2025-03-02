'use client';
import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const sources = ['Search Engine', 'Social Media', 'Referral', 'Advertisement', 'Conference', 'Other'];
const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Any'];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    bestTimeToContact: '',
    howDidYouHearAboutUs: '',
    otherSource: '',
    optIn: false,
    subject: '',
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      phone: value
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prevState => ({
      ...prevState,
      optIn: checked
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email && !formData.phone) errors.contact = 'Either email or phone is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) errors.phone = 'Phone number is invalid';
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
          onClose: () => router.push('/'),
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
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
    backgroundColor: '#27272a',
    color: '#ffffff',
    border: '1px solid #52525b',
  };

  const customFlagStyle = {
    backgroundColor: '#27272a',
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold text-zinc-100 mb-4 capitalize">
        Please use the following form to contact us
      </h2>
      
      <form onSubmit={handleSubmit} className="backdrop-blur-md space-y-5 border-2 border-zinc-600 mb-8 p-6 shadow-lg rounded-lg bg-zinc-900 w-full max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white font-medium">Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-zinc-800 text-white border-zinc-600 focus:border-red-400"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-white font-medium">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="bg-zinc-800 text-white border-zinc-600 focus:border-red-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-zinc-800 text-white border-zinc-600 focus:border-red-400"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white font-medium">Phone</Label>
          <PhoneInput
            country={'us'}
            value={formData.phone}
            onChange={handlePhoneChange}
            dropdownStyle={customDropdownStyle}
            buttonStyle={customFlagStyle}
            inputStyle={{
              width: '100%',
              backgroundColor: '#27272a',
              color: '#ffffff',
              border: '1px solid #52525b',
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem',
              paddingLeft: '3rem',
            }}
            containerClass="w-full"
            dropdownClass="custom-phone-dropdown"
            inputProps={{
              name: 'phone',
              className: 'focus:border-red-400 focus:ring focus:ring-red-300 focus:ring-opacity-50'
            }}
          />
          {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label className="text-white font-medium">Best Time to Contact</Label>
          <RadioGroup 
            value={formData.bestTimeToContact}
            onValueChange={(value) => handleSelectChange('bestTimeToContact', value)}
            className="flex space-x-4"
          >
            {timeOptions.map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <RadioGroupItem value={time} id={`time-${time}`} className="text-red-500" />
                <Label htmlFor={`time-${time}`} className="text-white">{time}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="howDidYouHearAboutUs" className="text-white font-medium">How Did You Hear About Us?</Label>
          <Select
            value={formData.howDidYouHearAboutUs}
            onValueChange={(value) => handleSelectChange('howDidYouHearAboutUs', value)}
          >
            <SelectTrigger className="bg-zinc-800 text-white border-zinc-600">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white border-zinc-600">
              {sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.howDidYouHearAboutUs === 'Other' && (
            <Input
              name="otherSource"
              value={formData.otherSource}
              onChange={handleChange}
              placeholder="Please specify how you heard about us"
              className="mt-2 bg-zinc-800 text-white border-zinc-600 focus:border-red-400"
            />
          )}
          {errors.otherSource && <p className="text-red-500 text-xs">{errors.otherSource}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-white font-medium">Subject</Label>
          <Textarea
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="bg-zinc-800 text-white border-zinc-600 focus:border-red-400"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="optIn" 
            checked={formData.optIn}
            onCheckedChange={handleCheckboxChange}
            className="border-zinc-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
          />
          <Label htmlFor="optIn" className="text-white text-sm font-medium">
            Opt-in to receive news and alerts
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-red-700 hover:bg-red-800 text-white border-0 font-semibold py-3"
        >
          Submit
        </Button>
      </form>
      
      <ToastContainer />
      
      <style jsx global>{`
        .react-tel-input .country-list {
          background-color: #27272a !important;
          color: #ffffff !important;
        }
        .react-tel-input .country-list .country:hover,
        .react-tel-input .country-list .country.highlight {
          background-color: #3f3f46 !important;
          color: #ffffff !important;
        }
        .react-tel-input .selected-flag {
          background-color: #27272a !important;
        }
        .react-tel-input .selected-flag:hover,
        .react-tel-input .selected-flag:focus {
          background-color: #3f3f46 !important;
        }
        .react-tel-input .flag-dropdown.open {
          background-color: #27272a !important;
        }
      `}</style>
    </div>
  );
}
