import React from "react";
import therapyImage1 from "../../Public/three.webp";
import therapyImage2 from "../../Public/fbeach.jpg";
import therapyImage3 from "../../Public/school.webp";
import HeaderSwitcher from "../../Components/Header/HeadSwitcher";
import Footer from "../../Components/Footer/Footer";

function Services() {
  return (
    <>
      <HeaderSwitcher />
      <div className="flex flex-col mt-20 space-y-10">
        <h1 className="text-4xl font-bold text-center">Our Therapy Services</h1>

        {/* Service 1 - Image on Left */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0 px-4">
          <img
            src={therapyImage1}
            alt="Play Therapy"
            className="w-full md:w-1/2 max-h-96 object-cover rounded-lg opacity-90 transition-transform transform hover:scale-105"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mt-2 md:mt-0">
              Play Therapy
            </h2>
            <p className="mt-2 text-center md:text-left text-xl">
              Play therapy is a form of therapy used primarily for children.
              That’s because children may not be able to process their own
              emotions or articulate problems to parents or other adults. While
              it may look like an ordinary playtime, play therapy can be much
              more than that. A trained therapist can use playtime to observe
              and gain insights into a child’s problems. The therapist can then
              help the child explore emotions and deal with unresolved trauma.
              Through play, children can learn new coping mechanisms and how to
              redirect inappropriate behaviors.
            </p>
          </div>
        </div>

        {/* Service 2 - Text on Left */}
        <div className="flex flex-col md:flex-row-reverse items-center md:space-x-6 space-y-4 md:space-y-0 px-4">
          <img
            src={therapyImage2}
            alt="Parent-Child Interaction Therapy (PCIT)"
            className="w-full md:w-1/2 max-h-96 object-cover rounded-lg opacity-90 transition-transform transform hover:scale-105"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mt-2 md:mt-0">
              Parent-Child Interaction Therapy (PCIT)
            </h2>
            <p className="mt-2 text-center md:text-left text-xl">
              Parent-Child Interaction Therapy – also called PCIT – is an
              evidence-based, short-term treatment designed to help young
              children with highly disruptive behavior learn to control their
              frustration. In PCIT, we work with each parent to strengthen their
              relationship with their child and build their confidence and
              ability to effectively guide and direct their child’s behavior,
              set limits, calmly discipline, and restore positive feelings to
              their interactions. PCIT treats the parent, the child and most
              importantly their interactions. Families change one interaction at
              a time!
            </p>
          </div>
        </div>

        {/* Service 3 - Image on Left */}
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0 px-4">
          <img
            src={therapyImage3}
            alt="Cognitive Behavioral Therapy (CBT)"
            className="w-full md:w-1/2 max-h-96 object-cover rounded-lg opacity-90 transition-transform transform hover:scale-105"
          />
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mt-2 md:mt-0">
              School Counseling
            </h2>
            <p className="mt-2 text-center md:text-left text-xl">
              Our school counseling program is dedicated to supporting every
              student’s personal, academic, and social development. Through
              individualized guidance, group activities, and classroom sessions,
              our trained school counselors work closely with students to help
              them in <strong>Achieve Academic Success, Explore Careers, Build Emotional Well-being and Navigate Life's Challenges</strong>
            </p>
          </div>
        </div>

    
        <div className="flex flex-col md:flex-row gap-8 px-4 py-6">
  <div className="flex-1 p-6 rounded-lg bg-[#DDD0C8]">
    <h2 className="font-semibold mb-2 text-2xl">Online Counseling Sessions</h2>
    <p>Receive professional counseling from the comfort and privacy of your own home.</p>
    <ul className="list-disc list-inside mt-2 space-y-1 text-xl">
      <li><strong>Convenient Online Access</strong> – Connect with our counselors virtually, without the need to travel.</li>
      <li><strong>Personalized Treatment Plans</strong> – Tailored counseling sessions designed to address your unique needs.</li>
      <li><strong>Regular Follow-Up Sessions</strong> – Consistent support through scheduled virtual follow-ups.</li>
      <li><strong>Real-time Emotional and Behavioral Assessments</strong> – Professional evaluations to help you understand and manage your mental well-being.</li>
    </ul>
  </div>
  
  <div className="flex-1 p-6 rounded-lg bg-[#DDD0C8]">
    <h2 className="font-semibold mb-2 text-2xl">Why Choose Our Counseling Services?</h2>
    <ul className="list-disc list-inside mt-2 space-y-1 text-xl">
      <li>✅ Experienced and Compassionate Counselors</li>
      <li>✅ Personalized Therapy Programs</li>
      <li>✅ Holistic Approach to Mental Well-being</li>
      <li>✅ Safe and Confidential Environment</li>
      <li>✅ Evidence-Based Therapy Techniques</li>
      <li>✅ Continuous Support and Follow-up Care</li>
    </ul>
  </div>
</div>
</div>

      <Footer />
    </>
  );
}

export default Services;
