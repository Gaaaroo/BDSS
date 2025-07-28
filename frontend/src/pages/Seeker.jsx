import React from 'react';
import SeekerForm from '../components/SeekerForm';
import Navbar from '../components/Navbar';
import { Title } from '../components/DonorForm';
import Footer from '../components/Footer';
import WidgetChat from '../components/WidgetChat';
import MapPin from '../components/MapPin';

export default function Seeker() {
  return (
    <div>
      <Navbar mode="" />
      <Title
        title={'Become a Seeker'}
        decription={
          <>
            Seeking blood isn’t a sign of weakness - <b> it’s a brave choice</b>
            .
            <br />
            A choice to fight for life, to hold on to hope, and to believe in
            healing.
            <br />
            It’s a powerful reminder that strength often begins with asking for
            help.
          </>
        }
      />
      <div className="flex-1 flex flex-col justify-center">
        <SeekerForm />
      </div>
      <WidgetChat />
      <MapPin />
      <Footer />
    </div>
  );
}
