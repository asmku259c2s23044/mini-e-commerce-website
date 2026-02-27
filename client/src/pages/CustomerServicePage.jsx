import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const CustomerServicePage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Customer <span className="text-emerald-600">Service</span></h1>
                <p className="text-xl text-gray-500">உதவி தேவைப்படுகிறதா? எமது குழு எப்போதும் உங்களுக்காக இங்கே இருக்கிறது.</p>
            </div>

            <div className="max-w-3xl mx-auto">
                {/* Contact Information */}
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 text-center">Contact Details</h3>

                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 h-fit">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Our Address</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        dr. 302/(4), Sammiyar street,<br />
                                        (Pillaiyarkovil Opposite Building),<br />
                                        Chokalingapuram, Melur TK,<br />
                                        Madurai DT. 625103
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 h-fit">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Phone Number</h4>
                                    <p className="text-gray-600 font-medium">+91 97513 21273</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 h-fit">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                                    <p className="text-gray-600 text-sm break-all">safrinbanukaburkhan@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 h-fit">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Working Hours</h4>
                                    <p className="text-gray-600 text-sm">Mon - Sat: 9:00 AM - 7:00 PM</p>
                                    <p className="text-gray-600 text-sm font-bold text-red-500">Sun: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerServicePage;
