# Candidate Form App with Validation and localStorage

A web application for submitting resumes and managing a candidate list.  
Built with a focus on client-side validation, data persistence in `localStorage`, and clean UI interactions.

## 🔧 Features

- ✅ Vacancy list with one-click position autofill
- ✅ Candidate submission form
- ✅ Client-side validation via JustValidate:
  - Required fields: name, surname, email, phone, desired position, resume URL
- ✅ Custom error messages
- ✅ Required checkbox for consent to data processing
- ✅ Data saved to and read from `localStorage`
- ✅ Dynamic candidate table rendering
- ✅ Sorting by surname and desired position
- ✅ Edit and delete functionality
- ✅ `mailto:` link to contact candidates by email
- ✅ Cookie consent block that hides on click

## 🧩 Tech Stack

- HTML5
- CSS3 (BEM naming)
- Vanilla JavaScript
- [JustValidate](https://github.com/horprogs/Just-validate)
- Browser `localStorage` API

## 📁 Folder Structure

```bash
project/
├── css/
├── fonts/
├── images/
├── index.js
├── vacancy.html
└── README.md
