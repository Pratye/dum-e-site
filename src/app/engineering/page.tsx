import type { Metadata } from "next";
import Image from "next/image";
import RobotViewerClient from "@/components/RobotViewerClient";
import LazyVideo from "@/components/LazyVideo";
import TrainingChart from "@/components/TrainingChart";
import BarCompare from "@/components/BarCompare";
import { Band, ButtonLink, Page, SimTag, StateMark, type State } from "@/components/ui";
import stats from "@/data/stats.json";
import curve from "@/data/training_curve.json";

export const metadata: Metadata = {
  title: "Engineering | Dum-E Robotics",
  description:
    "What Dum-E is building now: the dume_v3 humanoid design, a GPU-trained walking policy in simulation, and an arm with an automatic calibration layer for off-the-shelf vision-language-action models.",
};

// ---- every number comes from src/data/*.json (tools/make_stats.py, tools/make_curve.py) ----
const sc = (id: string) => {
  const s = stats.scenarios.find((r) => r.id === id);
  if (!s) throw new Error(`stats.json has no scenario "${id}"`);
  return s;
};
const verdict = (s: { survived_s: number; episode_s: number }): { state: State; label: string } =>
  s.survived_s >= 0.9 * s.episode_s ? { state: "done", label: "Walks" }
  : s.survived_s >= 0.6 * s.episode_s ? { state: "progress", label: "Partly" }
  : { state: "next", label: "Not yet" };

const ROWS = [
  ["flat", "Flat ground"], ["ramp_4_deg", "Ramp, 4°"], ["ramp_8_deg", "Ramp, 8°"], ["ramp_14_deg", "Ramp, 14°"],
  ["stairs_4_cm", "Stairs, 4 cm rise"], ["stairs_8_cm", "Stairs, 8 cm rise"], ["stairs_12_cm", "Stairs, 12 cm rise"],
] as const;

const SPECS: [string, string][] = [
  ["Height", "1.19 m"],
  ["Mass", "17.2 kg, from CAD with datasheet actuator masses"],
  ["Degrees of freedom", "20: twelve in the legs, four in each arm"],
  ["Leg actuators (prototype)", "Robstride quasi-direct-drive: RS00, RS01, RS03, RS06"],
  ["Arm actuators (prototype)", "Feetech STS bus servos"],
  ["Ankle", "Parallel linkage: two actuators per ankle, push rods and a U-joint"],
  ["Structure", "3D-printed links and shells, aluminium plates at the hips and torso"],
  ["Hands", "Tendon-driven, four fingers and a thumb (designed)"],
  ["Design check", "No clashes above 50 mm³ in the assembled CAD"],
];

const LESSONS: [string, string][] = [
  ["Knees that bent backwards",
    "The CAD gave the leg joints an axis whose positive direction was hyperextension, and every early policy learned a backwards-knee shuffle. A single-joint render test caught it; that test now runs before any training."],
  ["Joint limits 57 times too small",
    "A missing unit flag made the physics engine read radians as degrees, so the legs were nearly frozen and the actuators saturated. A settling test, not the reward curve, exposed it."],
  ["A randomiser that did nothing",
    "Slope randomisation wrote to a field the engine never reads, so every robot trained on flat ground. Results identical to the flat control, to the last digit, gave it away. Slopes are now real geometry."],
  ["A reward that capped foot lift at 6 cm",
    "The swing-height bonus stopped paying above 5 cm, so no amount of training could clear an 8 cm stair. We measured the lift first, then changed the reward."],
];

const STATUS: { name: string; note: string; state: State }[] = [
  { name: "Motor driver (RdriveS1)", note: "Designed in-house, built and bench tested", state: "done" },
  { name: "Robotic arm with teleoperation", note: "Built, tested end to end", state: "done" },
  { name: "Humanoid design (dume_v3)", note: "Complete: kinematics, structure, actuators, hands", state: "done" },
  { name: "Walking in simulation", note: "Flat ground and gentle slopes; stairs in training", state: "progress" },
  { name: "Vision-language-action control", note: "Off-the-shelf model plus calibration layer, validated in simulation", state: "progress" },
  { name: "First humanoid prototype", note: "Integration starts once simulation has de-risked the build", state: "next" },
  { name: "Closed-environment testing", note: "A factory and a household are committed as the first sites", state: "next" },
];

function Fig({ children, caption }: { children: React.ReactNode; caption: React.ReactNode }) {
  return (
    <figure>
      {children}
      <figcaption className="mt-3 flex flex-wrap items-center gap-2 text-[14px] leading-relaxed text-mist">{caption}</figcaption>
    </figure>
  );
}

export default function Engineering() {
  const flat = sc("flat");
  return (
    <Page>
      <Band tone="night" inner="pt-36 pb-16 sm:pt-44">
        <h1 className="display" style={{ fontSize: "clamp(2.8rem, 7.6vw, 6.6rem)" }}>Simulation first.<br />Hardware next.</h1>
        <p className="mt-6 max-w-[56ch] text-[19px] leading-relaxed text-mist">
          Before the first humanoid is assembled, we design it in CAD, simulate it in physics and teach it to walk on a GPU. This is where that work
          stands in October 2026, including what doesn&apos;t work yet.
        </p>
      </Band>

      {/* ── DESIGN ── */}
      <Band tone="night" id="design" inner="pb-24">
        <div className="border-t border-night-line pt-16">
          <h2 className="heading max-w-[24ch]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}>dume_v3: a 1.19 m, 20-joint humanoid, designed to be built</h2>
          <p className="measure mt-4 text-[17px] text-mist">
            Blue marks the battery, the compute stack and the parallel-ankle linkage. Designed from scratch in Fusion 360; the structural conventions
            (enclosed actuators, a parallel ankle) were learned from open-source production humanoids such as RoboParty&apos;s Roboto Origin. The CAD is
            complete; the robot is not yet assembled.
          </p>
          <div className="mt-10 overflow-hidden rounded-3xl border border-night-line"
            style={{ background: "radial-gradient(60% 70% at 50% 100%, rgba(76,125,255,0.18) 0%, rgba(10,21,48,0) 70%)" }}>
            <RobotViewerClient src="/models/dume_v3.glb" />
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <dl className="divide-y divide-night-line border-y border-night-line">
              {SPECS.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="text-[15px] text-fog">{k}</dt>
                  <dd className="text-[16px] text-lab">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-2 gap-3 self-start">
              {([["design_front", "Front"], ["design_side", "Side"], ["design_torso", "Shoulders and torso"], ["design_ankle", "Parallel ankle"]] as const).map(([f, label]) => (
                <figure key={f} className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-night-line">
                  <Image src={`/engineering/${f}.webp`} alt={`dume_v3, ${label.toLowerCase()}`} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
                  <figcaption className="absolute bottom-2 left-3 text-[13px] text-lab">{label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </Band>

      {/* ── SIMULATION ── */}
      <Band tone="night-2" id="simulation" inner="py-24 sm:py-28">
        <h2 className="heading max-w-[22ch]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}>Teaching it to walk before it exists</h2>
        <p className="measure mt-4 text-[17px] text-mist">
          A MuJoCo digital twin is generated directly from the CAD: every body, joint, mass and servo torque limit. A policy is trained on a GPU against
          thousands of simulated robots at once, with randomised mass, friction and motor strength, random shoves and noisy sensors. There is no motion
          capture; the gait comes from rewards for tracking a commanded speed, balance, left-right symmetry and foot clearance.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {([["walk_flat", "Flat ground, commanded 0.6 m/s"], ["walk_ramp4", "A 4° ramp"], ["walk_ramp8", "An 8° ramp"]] as const).map(([f, cap]) => (
            <Fig key={f} caption={<>{cap} <SimTag /></>}>
              <LazyVideo src={`/engineering/${f}.mp4`} poster={`/engineering/${f}.jpg`} aspect="16 / 9" label={`dume_v3 in simulation: ${cap.toLowerCase()}`} />
            </Fig>
          ))}
        </div>
        <p className="mt-4 max-w-[80ch] text-[14px] text-fog">
          Each clip is one rollout of the trained policy, replayed on the full-mesh model. The table averages many rollouts, so it is the honest picture and
          lower than a clean run.
        </p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <div><h3 className="heading mb-5 text-[22px]">How long it stays up, as training goes on</h3><TrainingChart /></div>
          <div>
            <h3 className="heading mb-5 text-[22px]">Where it stands</h3>
            <table className="w-full text-left text-[15px]">
              <tbody className="divide-y divide-night-line border-y border-night-line">
                {ROWS.map(([id, label]) => {
                  const s = sc(id); const v = verdict(s);
                  return (
                    <tr key={id}>
                      <th scope="row" className="py-3 pr-3 font-normal text-lab">{label}</th>
                      <td className="py-3 pr-3 whitespace-nowrap text-mist">
                        {v.state === "done" ? `${s.distance_m.toFixed(1)} m in ${s.survived_s.toFixed(0)} s` : `up ${s.survived_s.toFixed(1)} of ${s.episode_s.toFixed(0)} s`}
                      </td>
                      <td className="py-3 text-right text-mist"><StateMark state={v.state} label={v.label} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-4 text-[14px] leading-relaxed text-fog">
              {stats.rollouts_per_scenario} rollouts per row with random start states and random shoves, commanded 0.6 m/s. On flat ground it tracks that
              command to within {Math.abs(flat.vx - flat.cmd).toFixed(2)} m/s. Its feet lift to about 7 cm, enough for a 4 cm step but not 8 cm; the
              swing-height reward has since been retuned for the next training run.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <Fig caption={<>The live dashboard streams the newest policy while it trains. It runs the lightweight physics model, which is why the robot is drawn as capsules. <SimTag /></>}>
            <div className="relative aspect-[1280/690] w-full overflow-hidden rounded-2xl border border-night-line">
              <Image src="/engineering/dashboard.webp" alt="The live training dashboard: the dume_v3 policy walking in simulation, with live statistics and controls for command, terrain and camera" fill sizes="(min-width: 1180px) 1120px, 100vw" className="object-cover" />
            </div>
          </Fig>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-0">
          {[
            ["Real terrain", "Stairs and ramps are actual geometry placed per robot, not a tilted gravity vector. Each robot gets flat ground, a staircase or a hill, with rise and grade randomised."],
            ["Built to transfer", "The policy sees only what the real robot can measure. A privileged critic sees more during training, and sensor noise stops the policy leaning on a perfect state."],
            ["Scale", `About ${curve.total_steps_M} million training steps so far on a single cloud GPU.`],
          ].map(([h, d], i) => (
            <div key={h} className={`md:px-8 ${i ? "md:border-l md:border-night-line" : "md:pl-0"}`}>
              <h3 className="heading text-[20px]">{h}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-mist">{d}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ── LESSONS ── */}
      <Band tone="lab" id="lessons" inner="py-24 sm:py-28">
        <h2 className="heading max-w-[24ch] text-graphite" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}>Four problems that looked like training problems</h2>
        <p className="measure mt-4 text-[17px] text-fog">
          Most of the work in learned control is checking that the simulation is the thing you meant to build. Each of these cost days, and each is now a
          check that runs first.
        </p>
        <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {LESSONS.map(([h, d]) => (
            <div key={h} className="border-t border-lab-line pt-6">
              <h3 className="heading text-[22px] text-graphite">{h}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-fog">{d}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ── ARM + VLA ── */}
      <Band tone="night" id="arm" inner="py-24 sm:py-28">
        <h2 className="heading max-w-[22ch]" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}>An arm that calibrates itself</h2>
        <p className="measure mt-4 text-[17px] text-mist">
          The 5-joint arm, with a geared parallel-jaw gripper and a wrist camera, is built. The current work is deploying an off-the-shelf
          vision-language-action model, MolmoAct2, without fine-tuning, and adding an automatic calibration layer so the arm goes where the model intends.
          Every result in this section is measured in simulation; running it on the physical arm is next.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Fig caption={<>Scripted pick and place in the digital twin, with a force-limited gripper <SimTag /></>}>
            <LazyVideo src="/engineering/arm_pick_place.mp4" poster="/engineering/arm_pick_place.jpg" aspect="4 / 1" label="Simulated arm picking a cube and placing it on a tray" />
          </Fig>
          <Fig caption={<>MolmoAct2 in the loop, with real model inference at every step <SimTag /></>}>
            <LazyVideo src="/engineering/arm_molmoact2.mp4" poster="/engineering/arm_molmoact2.jpg" aspect="8 / 3" label="MolmoAct2 controlling the simulated arm" />
          </Fig>
        </div>
        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="heading mb-6 text-[22px]">Mean reach error, in simulation</h3>
            <BarCompare unit="mm"
              ariaLabel="Mean reach error: 28.7 mm with the uncalibrated CAD model, 1.5 mm after automatic calibration, 110.3 mm after the camera is knocked, 1.3 mm after recalibrating."
              bars={[
                { label: "CAD model, uncalibrated", value: 28.7 },
                { label: "After automatic calibration", value: 1.5, accent: true },
                { label: "After the camera is knocked", value: 110.3 },
                { label: "After recalibrating", value: 1.3, accent: true },
              ]} />
            <p className="mt-6 text-[15px] leading-relaxed text-mist">
              A printed arm never matches its CAD. The simulated &quot;real&quot; arm gets hidden build errors: servo zeros up to ±4°, gain errors up to ±4%,
              links up to 3 mm off and a camera 25 mm and 3° from where we think it is. The controller knows only the CAD. Nineteen parameters are then
              fitted at once from AprilTag observations by nonlinear least squares, with no manual tuning.
            </p>
          </div>
          <div>
            <Fig caption={<>Tag collection, then the same targets with the CAD model and the calibrated model, then a camera knock and recovery <SimTag /></>}>
              <LazyVideo src="/engineering/arm_calibration.mp4" poster="/engineering/arm_calibration.jpg" aspect="8 / 3" label="Calibration demonstration in simulation" />
            </Fig>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6">
              {[["19", "parameters fitted at once"], ["0.52 mm", "held-out tag prediction error"], ["5.98 GiB", "MolmoAct2 weights at 8-bit"], ["≈5 s", "per action chunk on a 16 GB laptop GPU"]].map(([v, l]) => (
                <div key={l}><dt className="numeral text-[30px] text-lab">{v}</dt><dd className="mt-1 text-[14px] text-mist">{l}</dd></div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-14 rounded-3xl border border-night-line bg-night-2 p-8">
          <h3 className="heading text-[20px]">What we found first</h3>
          <p className="mt-2 max-w-[80ch] text-[16px] leading-relaxed text-mist">
            Zero-shot in simulation, the model moves the arm away from the cube. We tried all eight joint-sign conventions and five camera framings with the
            real model, and none made it reach. That rules out configuration errors and points to the gap between rendered images and the real-world images
            it was trained on. A real camera on the real arm should narrow that gap; the calibration layer removes the geometric part of the problem.
          </p>
        </div>
      </Band>

      {/* ── HARDWARE + STATUS ── */}
      <Band tone="lab" id="hardware" inner="py-24 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="heading text-graphite" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}>Already built</h2>
            <div className="mt-8 space-y-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="heading text-[20px] text-graphite">RdriveS1 motor driver</h3><span className="text-graphite"><StateMark state="done" label="Built and bench tested" /></span></div>
                <p className="mt-2 text-[16px] leading-relaxed text-fog">A field-oriented-control driver designed in-house around commodity parts (STL180N6F7 MOSFETs, an EG2133 gate driver, an AS5600 encoder). Servo drives dominate a robot&apos;s cost, so this is the first of the three decisions behind the ₹1–5 lakh price.</p>
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="heading text-[20px] text-graphite">Robotic arm with teleoperation</h3><span className="text-graphite"><StateMark state="done" label="Built and tested" /></span></div>
                <p className="mt-2 text-[16px] leading-relaxed text-fog">A teleoperated arm that demonstrates the full chain of command, drive and motion working outside simulation.</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="heading text-graphite" style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}>Where each piece stands</h2>
            <ul className="mt-8 divide-y divide-lab-line border-y border-lab-line">
              {STATUS.map((s) => (
                <li key={s.name} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4">
                  <div className="min-w-0"><p className="text-[16px] text-graphite">{s.name}</p><p className="text-[14px] text-fog">{s.note}</p></div>
                  <span className="text-graphite"><StateMark state={s.state} /></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-night p-8 text-lab sm:p-10">
          <p className="heading max-w-[26ch] text-[26px] sm:text-[30px]">Building with robots, or backing the people who do?</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/waitlist">Join the waitlist</ButtonLink>
            <ButtonLink href="/investors" kind="secondary">For investors</ButtonLink>
          </div>
        </div>
      </Band>
    </Page>
  );
}
