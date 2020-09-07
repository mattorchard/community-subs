import React from "react";
import "./EditDetailsForm.css";

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
  event.preventDefault();

const EditDetailsForm = () => (
  <form onSubmit={handleSubmit} className="edit-details-form" />
);

export default EditDetailsForm;
