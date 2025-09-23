import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Get in Touch</h2>
        <p className="text-lg text-center text-gray-600 mb-8">
          For any inquiries, wholesale orders, or product requests, please feel free to contact us.
        </p>
        <ContactForm />
      </div>
    </section>
  );
};

export default ContactPage;
