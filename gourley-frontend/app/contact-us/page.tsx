"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import styles from "./contact.module.css";

type FormData = {
  timestamp: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  jobType: string;
  description: string;
};

export default function Contact() {
  const [services, setServices] = useState<string[]>([]);
  const [jobType, setJobType] = useState("");

  // set services dropdown dynamically
  useEffect(() => {
    async function loadServices() {
      const res = await fetch("/api/services");
      const data = await res.json();
      const filteredData = data.map((row: { [x: string]: any; }) => row["Services"]).filter(Boolean);
      setServices(filteredData);
    }
      loadServices();
  }, []);
  
  // form
  const [form, setForm] = useState<FormData>({
    timestamp: new Date().toISOString(),
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    jobType: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First Name is required";
    if (!form.lastName.trim()) return "Last Name is required";
    if (!form.email.trim()) return "E-mail is required";
    if (!form.jobType) return "Please select a service type";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
 try {
      // Post to your API endpoint that adds data to Google Sheets
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit form");

      setSuccess("Thank you! Your message has been sent.");
      setForm({
        timestamp: new Date().toISOString(),
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        jobType: "",
        description: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.desktopImg}>
          {/* <Image
            src={"/o.jpg"}
            alt={"man in orange shirt cutting tree"}
            width={500}
            height={500}
          /> */}
          <video autoPlay muted playsInline loop>
            <source src="/videos/IMG_5346.mp4" type="video/mp4" />
            Your browser does not support video playback.
          </video>
        </div>
        <div className={styles.formWrapper}>
          <h1>How Can We Help You?</h1>
          <form onSubmit={handleSubmit} noValidate>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            {/* Hidden timestamp */}
            <input type="hidden" name="timestamp" value={form.timestamp} />

            <div className={styles.formRow}>
              <div>
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First"
                ></input>
              </div>
              <div>
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last"
                ></input>
              </div>
            </div>

            <div className={styles.formRow}>
              <div>
                <label htmlFor="phone">Contact Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 555-555"
                ></input>
              </div>
              <div>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="hi@myemail.com"
                ></input>
              </div>
            </div>

            <div className={`${styles.formRow} ${styles.fullWidth}`}>
              <div>
                <label htmlFor="styleType">Service Type</label>
                <select
                  id="jobType"
                  name="jobType"
                  value={jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select One
                  </option>
                  {services.map((service, i: number) => {
                    return (
                      <option key={i} value={service}>
                        {service}
                      </option>
                    );
                  })}
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className={`${styles.formRow} ${styles.fullWidth}`}>
              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="How can we help?"
                ></textarea>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button
                type="submit"
                disabled={loading}
                className="button-primary arrow-button"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send It
                    <Image
                      src={"/icons/arrow.svg"}
                      alt={"arrow"}
                      width={10}
                      height={10}
                    />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
