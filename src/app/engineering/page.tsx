import type { Metadata } from "next";
import Image from "next/image";
import RobotViewerClient from "@/components/RobotViewerClient";
import LazyVideo from "@/components/LazyVideo";
import TrainingChart from "@/components/TrainingChart";
import BarCompare from "@/components/BarCompare";
import { Shell, SiteFooter, Section, H2, Lede, Chip, Card, EMAIL, ORANGE, LINE, MUTED, FG } from "@/components/ui";
import type { Tone } from "@/components/ui";
import stats from "@/data/stats.json";
import curve from "@/data/training_curve.json";

export const metadata: Metadata = {
  title: "Engineering | Dum-E Robotics",
  description:
    "What Dum-E is building right now: the dume_v3 humanoid design, a GPU-trained walking policy in simulation, and an arm with an automatic calibration layer for off-the-shelf vision-language-action models.",
};

// ---- numbers come from src/data/*.json (tools/make_stats.py, tools/make_curve.py), never typed by hand ----
const sc = (id: string) => {
  const s = stats.scenarios.find((r) => r.id === id);
  if (!s) throw new Error(`stats.json has no scenario "${id}"`);
  return s;
};
const verdict = (s: { survived_s: number; episode_s: number }): { tone: Tone; label: string } =>
  s.survived_s >= 0.9 * s.episode_s ? { tone: "done", label: "Walks" }
  : s.survived_s >= 0.6 * s.episode_s ? { tone: "progress", label: "Partly" }
  : { tone: "next", label: "Not yet" };

const ROWS: { id: string; label: string }[] = [
  { id: "flat", label: "Flat ground" },
  { id: "ramp_4_deg", label: "Ramp, 4°" },
  { id: "ramp_8_deg", label: "Ramp, 8°" },
  { id: "ramp_14_deg", label: "Ramp, 14°" },
  { id: "stairs_4_cm", label: "Stairs, 4 cm rise" },
  { id: "stairs_8_cm", label: "Stairs, 8 cm rise" },
  { id: "stairs_12_cm", label: "Stairs, 12 cm rise" },
];

const SPECS: [string, string][] = [
  ["Height", "1.19 m"],
  ["Mass", "17.2 kg (CAD, with datasheet actuator masses)"],
  ["Degrees of freedom", "20: 12 in the legs, 4 in each arm"],
  ["Leg actuators (prototype)", "Robstride quasi-direct-drive: RS00, RS01, RS03, RS06"],
  ["Arm actuators (prototype)", "Feetech STS bus servos"],
  ["Ankle", "Parallel linkage, two actuators per ankle, push rods and a U-joint"],
  ["Structure", "3D-printed links and shells, aluminium plates at the hips and torso"],
  ["Hands", "Tendon-driven, four fingers and a thumb (designed)"],
  ["Design check", "No clashes above 50 mm³ in the assembled CAD"],
];

const LESSONS: [string, string][] = [
  ["Knees that bent backwards",
    "The CAD gave the leg joints an axis whose positive direction was hyperextension. Every early walking policy learned a backwards-knee shuffle. A single-joint render test caught it; now it runs before any training."],
  ["Joint limits 57× too small",
    "A missing unit flag made the physics engine read radians as degrees, so the legs were nearly frozen and the actuators saturated. A settling test, not the reward curve, exposed it."],
  ["A randomiser that did nothing",
    "Slope randomisation wrote to a field the engine never reads, so every robot trained on flat ground. Results identical to the flat control, to the last digit, gave it away. Slopes are now real geometry."],
  ["A reward that capped foot lift at 6 cm",
    "The swing-height bonus stopped paying above 5 cm, so the policy could not clear a stair taller than about 8 cm no matter how long it trained. We measured the lift first, then changed the reward."],
];

const STATUS: { name: string; note: string; tone: Tone; chip: string }[] = [
  { name: "FOC motor driver (RdriveS1)", note: "Designed in-house, bench tested", tone: "done", chip: "Built" },
  { name: "Robotic arm with teleoperation", note: "Tested end to end", tone: "done", chip: "Built" },
  { name: "Humanoid CAD design (dume_v3)", note: "Complete: kinematics, structure, actuators, hands", tone: "done", chip: "Complete" },
  { name: "Humanoid walking in simulation", note: "Flat ground and gentle slopes working; stairs in training", tone: "progress", chip: "In progress" },
  { name: "Vision-language-action control", note: "Off-the-shelf model, automatic calibration layer; simulation validated", tone: "progress", chip: "In progress" },
  { name: "Full humanoid prototype integration", note: "Starts once the simulation work de-risks the build", tone: "next", chip: "Next" },
  { name: "Closed-environment testing", note: "Factory and household test sites already committed", tone: "next", chip: "After integration" },
];

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6" style={{ borderTop: `1px solid ${LINE}` }}>
      <dt className="shrink-0 text-xs uppercase tracking-widest sm:w-44" style={{ color: ORANGE }}>{k}</dt>
      <dd className="text-sm" style={{ color: FG }}>{v}</dd>
    </div>
  );
}

function Figure({ children, caption }: { children: React.ReactNode; caption: React.ReactNode }) {
  return (
    <figure>
      {children}
      <figcaption className="mt-3 text-xs leading-relaxed" style={{ color: MUTED }}>{caption}</figcaption>
    </figure>
  );
}

export default function Engineering() {
  const flat = sc("flat");
  return (
    <Shell active="engineering">
      {/* ── HEADER ── */}
      <section className="pt-16 pb-10 lg:pt-24">
        <p className="eyebrow fade-up fade-up-1 mb-5">Engineering · October 2026</p>
        <h1 className="disp fade-up fade-up-2 leading-[0.98] tracking-[-0.03em]" style={{ fontSize: "clamp(2.2rem, 7vw, 5.6rem)" }}>
          Simulation first.<br />Hardware next.
        </h1>
        <p className="fade-up fade-up-3 mt-6 max-w-[620px] leading-[1.72]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.15rem)", color: MUTED }}>
          Before the first humanoid is assembled, we design it in CAD, simulate it in physics, and teach it to walk on a GPU. This is where that work stands
          today, including what does not work yet.
        </p>
        <div className="fade-up fade-up-4 mt-8 flex flex-wrap gap-2.5">
          <Chip tone="done">Humanoid CAD complete</Chip>
          <Chip tone="progress">Walking in simulation</Chip>
          <Chip tone="done">Arm built</Chip>
          <Chip tone="progress">VLA calibration in simulation</Chip>
          <Chip tone="next">Humanoid assembly next</Chip>
        </div>
      </section>

      {/* ── DESIGN ── */}
      <Section id="design">
        <p className="eyebrow mb-3">Design</p>
        <H2>dume_v3: a 1.19 m, 20-DOF humanoid, designed to be built</H2>
        <Lede>
          Drag to rotate, scroll to zoom. White is structure; orange marks the battery, the compute stack and the parallel-ankle linkage. Designed from scratch
          in Fusion 360; the structural conventions (enclosed actuators, a parallel ankle) were learned from open-source production humanoids such as
          RoboParty&apos;s Roboto Origin. The CAD is complete; the robot is not yet assembled.
        </Lede>
        <div
          className="relative mt-8 w-full rounded-2xl overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,102,0,0.08) 0%, rgba(13,13,13,0.98) 60%)", border: `1px solid ${LINE}` }}
        >
          <RobotViewerClient src="/models/dume_v3.glb" />
        </div>
        <dl className="mt-10 grid">
          {SPECS.map(([k, v]) => <Spec key={k} k={k} v={v} />)}
        </dl>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {([["design_front", "Front"], ["design_side", "Side"], ["design_torso", "Shoulders and torso"]] as const).map(([f, label]) => (
            <div key={f} className="relative aspect-[16/10] overflow-hidden rounded-2xl" style={{ border: `1px solid ${LINE}` }}>
              <Image src={`/engineering/${f}.webp`} alt={`dume_v3 ${label.toLowerCase()} view`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              <span className="absolute left-3 bottom-3 text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: FG }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── SIMULATION ── */}
      <Section id="simulation">
        <p className="eyebrow mb-3">Simulation and learned walking</p>
        <H2>Teaching it to walk before it exists</H2>
        <Lede>
          A MuJoCo digital twin is generated directly from the CAD: every body, joint, mass and servo torque limit. A policy is then trained on a GPU against
          thousands of simulated robots at once, with randomised mass, friction and motor strength, random shoves, and noisy sensors. There is no motion capture;
          the gait emerges from rewards for tracking a commanded velocity, balance, left-right symmetry and foot clearance.
        </Lede>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Figure caption={<>Flat ground, commanded 0.6 m/s. <Chip tone="sim">Simulation</Chip></>}>
            <LazyVideo src="/engineering/walk_flat.mp4" poster="/engineering/walk_flat.jpg" aspect="16 / 9" label="dume_v3 walking on flat ground in simulation" />
          </Figure>
          <Figure caption={<>A 4° ramp. <Chip tone="sim">Simulation</Chip></>}>
            <LazyVideo src="/engineering/walk_ramp4.mp4" poster="/engineering/walk_ramp4.jpg" aspect="16 / 9" label="dume_v3 walking up a 4 degree ramp in simulation" />
          </Figure>
          <Figure caption={<>An 8° ramp. <Chip tone="sim">Simulation</Chip></>}>
            <LazyVideo src="/engineering/walk_ramp8.mp4" poster="/engineering/walk_ramp8.jpg" aspect="16 / 9" label="dume_v3 walking up an 8 degree ramp in simulation" />
          </Figure>
        </div>
        <p className="mt-3 text-xs leading-relaxed" style={{ color: MUTED }}>
          Each clip is one rollout of the trained policy, with the joint angles replayed on the full-mesh model. The table below is the honest picture: it
          averages many rollouts, so it is lower than a clean run.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Learning curve</p>
            <TrainingChart />
          </div>
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Where it stands</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  {ROWS.map(({ id, label }) => {
                    const s = sc(id); const v = verdict(s);
                    const detail = v.tone === "done"
                      ? `${s.distance_m.toFixed(1)} m in ${s.survived_s.toFixed(0)} s`
                      : `upright ${s.survived_s.toFixed(1)} of ${s.episode_s.toFixed(0)} s`;
                    return (
                      <tr key={id} style={{ borderTop: `1px solid ${LINE}` }}>
                        <td className="py-3 pr-3" style={{ color: FG }}>{label}</td>
                        <td className="py-3 pr-3 whitespace-nowrap" style={{ color: MUTED }}>{detail}</td>
                        <td className="py-3 text-right"><Chip tone={v.tone}>{v.label}</Chip></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed" style={{ color: MUTED }}>
              {stats.rollouts_per_scenario} rollouts per row, random start states and random shoves, commanded 0.6 m/s. Flat ground tracks that command to within{" "}
              {Math.abs(flat.vx - flat.cmd).toFixed(2)} m/s. Stairs are the next milestone: the policy&apos;s feet lift to about 7 cm, so it clears a 4 cm step but
              not 8 cm. The swing-height reward has since been retuned for the next training run.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Figure caption={<>The live dashboard streams the newest policy while it trains, with controls for command, terrain and camera. It runs the lightweight physics model, which is why the robot is drawn as capsules. <Chip tone="sim">Simulation</Chip></>}>
            <div className="relative aspect-[1280/690] w-full overflow-hidden rounded-2xl" style={{ border: `1px solid ${LINE}` }}>
              <Image src="/engineering/dashboard.webp" alt="The live training dashboard showing the dume_v3 policy walking in simulation, with live statistics and command, terrain and camera controls" fill sizes="(min-width: 1100px) 1020px, 100vw" className="object-cover" />
            </div>
          </Figure>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card>
            <p className="mb-3 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Real terrain</p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Stairs and ramps are actual geometry placed per robot, in the model itself, not a tilted gravity vector. Each robot gets flat ground, a staircase
              or a hill, with the rise and grade randomised.
            </p>
          </Card>
          <Card>
            <p className="mb-3 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Built to transfer</p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              The policy sees only what the real robot can measure. A privileged critic is allowed to see more during training, and sensor noise is injected so the
              policy cannot lean on a perfect state.
            </p>
          </Card>
          <Card>
            <p className="mb-3 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Scale</p>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              About {curve.total_steps_M} million training steps so far on a single cloud GPU, with a live dashboard that streams the current policy while it
              trains.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── LESSONS ── */}
      <Section id="lessons">
        <p className="eyebrow mb-3">What broke, and what we learned</p>
        <H2>Four problems that looked like training problems</H2>
        <Lede>
          Most of the work in learned control is checking that the simulation is the thing you meant to build. These each cost us days; each is now a test that
          runs first.
        </Lede>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LESSONS.map(([h, d], i) => (
            <Card key={h}>
              <p className="disp mb-3 text-sm" style={{ color: ORANGE }}>0{i + 1}</p>
              <h3 className="mb-2 font-semibold" style={{ color: FG }}>{h}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{d}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── ARM + VLA ── */}
      <Section id="arm">
        <p className="eyebrow mb-3">Arm and vision-language-action control</p>
        <H2>An arm that calibrates itself</H2>
        <Lede>
          The 5-DOF arm, with a geared parallel-jaw gripper and a wrist camera, is built. The current work is deploying an off-the-shelf vision-language-action
          model, MolmoAct2, with no fine-tuning, and adding an automatic calibration layer so that what the model commands is where the arm actually goes.
          Everything on this section is measured in simulation; running it on the physical arm is the next milestone.
        </Lede>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Figure caption={<>Scripted pick and place in the digital twin, with a force-limited gripper. <Chip tone="sim">Simulation</Chip></>}>
            <LazyVideo src="/engineering/arm_pick_place.mp4" poster="/engineering/arm_pick_place.jpg" aspect="4 / 1" label="Simulated arm picking a cube and placing it on a tray" />
          </Figure>
          <Figure caption={<>MolmoAct2 in the loop, real model inference at every step. <Chip tone="sim">Simulation</Chip></>}>
            <LazyVideo src="/engineering/arm_molmoact2.mp4" poster="/engineering/arm_molmoact2.jpg" aspect="8 / 3" label="MolmoAct2 controlling the simulated arm" />
          </Figure>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Mean reach error · simulation</p>
            <BarCompare
              unit="mm"
              ariaLabel="Mean reach error: 28.7 mm with the uncalibrated CAD model, 1.5 mm after automatic calibration, 110.3 mm after the camera is knocked, 1.3 mm after recalibrating."
              bars={[
                { label: "CAD model, uncalibrated", value: 28.7 },
                { label: "After automatic calibration", value: 1.5, accent: true },
                { label: "After the camera is knocked", value: 110.3 },
                { label: "After recalibrating", value: 1.3, accent: true },
              ]}
            />
            <p className="mt-5 text-xs leading-relaxed" style={{ color: MUTED }}>
              A printed arm never matches its CAD. The simulated &quot;real&quot; arm is given hidden build errors (servo zeros up to ±4°, gain errors up to ±4%,
              links up to 3 mm off, a camera 25 mm and 3° from where we think it is). The controller only knows the CAD. 19 parameters are then fitted at once
              from AprilTag observations by nonlinear least squares, with no manual tuning.
            </p>
          </div>
          <div>
            <Figure caption={<>Tag collection, then the same targets reached with the CAD model and the calibrated model, then a camera knock and automatic recovery. <Chip tone="sim">Simulation</Chip></>}>
              <LazyVideo src="/engineering/arm_calibration.mp4" poster="/engineering/arm_calibration.jpg" aspect="8 / 3" label="Calibration demonstration in simulation" />
            </Figure>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              {[["19", "parameters fitted"], ["0.52 mm", "held-out tag prediction error"], ["5.98 GiB", "MolmoAct2 weights, int8"], ["≈ 5 s", "per action chunk, 16 GB laptop GPU"]].map(([v, l]) => (
                <div key={l}>
                  <dt className="disp text-xl" style={{ color: FG }}>{v}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <Card className="mt-10">
          <p className="mb-2 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>First finding</p>
          <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
            Zero-shot in simulation, the model moves the arm away from the cube. We tested all eight joint-sign conventions and five camera framings with the
            real model, and none made it reach. That rules out configuration errors and points to the visual gap between rendered images and the real-world images
            it was trained on. A real camera on the real arm should narrow that gap; the calibration layer removes the geometric part of the problem.
          </p>
        </Card>
      </Section>

      {/* ── HARDWARE ── */}
      <Section id="hardware">
        <p className="eyebrow mb-3">Hardware</p>
        <H2>What is already built</H2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: ORANGE }}>RdriveS1 motor driver</p>
              <Chip tone="done">Built · bench tested</Chip>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              A field-oriented-control driver designed in-house around commodity parts (STL180N6F7 MOSFETs, an EG2133 gate driver, an AS5600 encoder). Industrial
              servo drives dominate a robot&apos;s cost; designing this one is the first of three decisions that take the price toward ₹1–5 L.
            </p>
          </Card>
          <Card>
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-widest" style={{ color: ORANGE }}>Robotic arm with teleoperation</p>
              <Chip tone="done">Built · tested end to end</Chip>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              A teleoperated arm that demonstrates the full chain of command, drive and motion working outside simulation.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── STATUS ── */}
      <Section id="status">
        <p className="eyebrow mb-3">Status board</p>
        <H2>Where each piece stands</H2>
        <div className="mt-8">
          {STATUS.map((s, i) => (
            <div key={s.name} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4" style={{ borderTop: i ? `1px solid rgba(255,102,0,0.1)` : "none" }}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium" style={{ color: FG }}>{s.name}</p>
                <p className="mt-0.5 text-sm" style={{ color: MUTED }}>{s.note}</p>
              </div>
              <Chip tone={s.tone}>{s.chip}</Chip>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl p-8 sm:p-10" style={{ border: `1px solid ${LINE}`, background: "rgba(255,102,0,0.04)" }}>
          <p className="disp leading-[1.1]" style={{ fontSize: "clamp(1.3rem, 3vw, 2.2rem)", color: FG }}>
            Building with robots, or backing the people who do?
          </p>
          <a href={`mailto:${EMAIL}`} className="mt-6 inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200" style={{ background: ORANGE, color: "#0D0D0D" }}>
            Email the founder
          </a>
        </div>
      </Section>

      <SiteFooter />
    </Shell>
  );
}
