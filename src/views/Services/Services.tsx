import { useState } from "react";
import ServicesAction from "./ServicesAction";
import ServicesList from "./ServicesList";
import ServiceDialog from "./ServiceDialog";

const Services = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <ServicesAction onOpenDialog={() => setDialogOpen(true)} />
      <ServicesList />
      <ServiceDialog open={dialogOpen} handler={() => setDialogOpen(false)} />
    </>
  );
};

export default Services;
