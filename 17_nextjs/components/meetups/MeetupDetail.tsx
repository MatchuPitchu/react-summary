import { NextPage } from 'next';
import React from 'react';
import classes from './MeetupDetail.module.css';

type Props = {
  image: string;
  alt: string;
  title: string;
  address: string;
  description: string;
};

const MeetupDetail: NextPage<Props> = ({ image, alt, title, address, description }) => {
  return (
    <section className={classes.detail}>
      <img src={image} alt={alt} />
      <h1>{title}</h1>
      <address>{address}</address>
      <p>{description}</p>
    </section>
  );
};

export default MeetupDetail;
