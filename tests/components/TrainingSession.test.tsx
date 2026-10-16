import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TrainingSession, { type MasteryTarget } from "@/components/training/TrainingSession";
import type { TrainingItem } from "@/lib/training";
import { jsonResponse } from "../helpers/fixtures";

const router = vi.hoisted(() => ({ refresh: vi.fn(), push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));
const sounds = vi.hoisted(() => ({ playCorrect: vi.fn(), playWrong: vi.fn(), playFanfare: vi.fn() }));
vi.mock("@/lib/training-sounds", () => sounds);

const fetchMock = vi.fn<typeof fetch>();
const scrollToMock = vi.fn();

beforeEach(() => {
  router.refresh.mockReset();
  for (const play of Object.values(sounds)) play.mockReset();
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(jsonResponse({ masteredAt: "2024-05-10T12:00:00.000Z" }));
  vi.stubGlobal("fetch", fetchMock);
  scrollToMock.mockReset();
  vi.stubGlobal("scrollTo", scrollToMock);
});

const base = { problemTitle: "Valid Palindrome", problemSummary: "Return `True` if it reads the same both ways." };

function typedItem(id: string, overrides: Partial<Extract<TrainingItem, { kind: "type" }>> = {}): TrainingItem {
  return {
    ...base,
    id,
    kind: "type",
    prompt: `Typed ${id}`,
    answers: ["isalnum"],
    explanation: `Explanation ${id}`,
    mistakes: [{ answers: ["isalpha"], why: "Digits count too." }],
    ...overrides,
  };
}

function choiceItem(id: string): TrainingItem {
  return {
    ...base,
    id,
    kind: "choice",
    prompt: `Choice ${id}`,
    options: [
      { text: "Wrong one", why: "Because it's wrong." },
      { text: "Right one", correct: true },
    ],
    explanation: `Explanation ${id}`,
  };
}

function start(items: TrainingItem[], mastery?: MasteryTarget) {
  const user = userEvent.setup();
  render(<TrainingSession items={items} title="Valid Palindrome" backHref="/patterns/1" mastery={mastery} />);
  return user;
}

const answerBox = () => screen.getByRole("textbox", { name: "Your answer" });
const checkButton = () => screen.getByRole("button", { name: "Check" });
const continueButton = () => screen.getByRole("button", { name: "Continue" });
const progress = () => screen.getByRole("progressbar");

async function typeAndCheck(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.clear(answerBox());
  await user.type(answerBox(), text);
  await user.click(checkButton());
}

describe("TrainingSession layout", () => {
  it("shows the problem title and summary above every exercise", () => {
    start([typedItem("a")]);
    expect(screen.getByText("Valid Palindrome")).toBeInTheDocument();
    expect(screen.getByText(/reads the same both ways/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Typed a" })).toBeInTheDocument();
  });

  it("shows a snippet labelled Python, or the full solution labelled Solution", () => {
    const { unmount } = render(
      <TrainingSession items={[typedItem("a", { code: "x = ___" })]} title="t" backHref="/" />,
    );
    expect(screen.getByText("Python")).toBeInTheDocument();
    unmount();
    render(<TrainingSession items={[typedItem("b", { code: "def f(): pass", solution: true })]} title="t" backHref="/" />);
    expect(screen.getByText("Solution")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /copy/i })).toBeNull();
  });

  it("starts with an empty progress bar and a quit link back to the path", () => {
    start([typedItem("a"), typedItem("b")]);
    expect(progress()).toHaveAttribute("aria-valuenow", "0");
    expect(progress()).toHaveAttribute("aria-valuemax", "2");
    expect(screen.getByRole("link", { name: "Quit training" })).toHaveAttribute("href", "/patterns/1");
  });

  it("turns off autocorrect and autocapitalisation for typed answers", () => {
    start([typedItem("a")]);
    expect(answerBox()).toHaveAttribute("autocapitalize", "off");
    expect(answerBox()).toHaveAttribute("autocorrect", "off");
    expect(answerBox()).toHaveAttribute("spellcheck", "false");
  });
});

describe("typed exercises", () => {
  it("can't be checked while the answer is empty", async () => {
    const user = start([typedItem("a")]);
    expect(checkButton()).toBeDisabled();
    await user.type(answerBox(), "   ");
    expect(checkButton()).toBeDisabled();
  });

  it("accepts a correct answer, ignoring case and spaces, and explains it", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await typeAndCheck(user, "  IsAlNum ");
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.getByText("Explanation a")).toBeInTheDocument();
    expect(answerBox()).toHaveAttribute("readonly");
    await user.click(continueButton());
    expect(progress()).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByRole("heading", { name: "Typed b" })).toBeInTheDocument();
    expect(answerBox()).toHaveValue("");
  });

  it("explains a wrong answer: the specific mistake, the correct answer and why", async () => {
    const user = start([typedItem("a")]);
    await typeAndCheck(user, "isalpha");
    expect(screen.getByText("Not quite")).toBeInTheDocument();
    expect(screen.getByText("Digits count too.")).toBeInTheDocument();
    expect(screen.getByText("Correct answer")).toBeInTheDocument();
    expect(screen.getByText("isalnum")).toBeInTheDocument();
    expect(screen.getByText("Explanation a")).toBeInTheDocument();
  });

  it("still shows the correct answer for an unanticipated wrong answer", async () => {
    const user = start([typedItem("a")]);
    await typeAndCheck(user, "banana");
    expect(screen.getByText("Not quite")).toBeInTheDocument();
    expect(screen.queryByText("Digits count too.")).toBeNull();
    expect(screen.getByText("isalnum")).toBeInTheDocument();
  });

  it("checks and continues with the Enter key", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await user.type(answerBox(), "isalnum{Enter}");
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Typed b" })).toBeInTheDocument();
  });
});

describe("multiple-choice exercises", () => {
  it("can't be checked until an option is picked", async () => {
    const user = start([choiceItem("c")]);
    expect(checkButton()).toBeDisabled();
    await user.click(screen.getByRole("radio", { name: /right one/i }));
    expect(screen.getByRole("radio", { name: /right one/i })).toHaveAttribute("aria-checked", "true");
    expect(checkButton()).toBeEnabled();
  });

  it("accepts the correct option", async () => {
    const user = start([choiceItem("c")]);
    await user.click(screen.getByRole("radio", { name: /right one/i }));
    await user.click(checkButton());
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
  });

  it("explains why a wrong option is wrong and names the right one", async () => {
    const user = start([choiceItem("c")]);
    await user.click(screen.getByRole("radio", { name: /wrong one/i }));
    await user.click(checkButton());
    expect(screen.getByText("Not quite")).toBeInTheDocument();
    expect(screen.getByText("Because it's wrong.")).toBeInTheDocument();
    expect(screen.getAllByText("Right one")).toHaveLength(2); // the option and the "correct answer" line
  });

  it("picks options with number keys and checks with Enter", async () => {
    const user = start([choiceItem("c")]);
    await user.keyboard("2");
    expect(screen.getByRole("radio", { name: /right one/i })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("9"); // out of range: ignored
    expect(screen.getByRole("radio", { name: /right one/i })).toHaveAttribute("aria-checked", "true");
    await user.keyboard("{Enter}");
    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });
});

describe("the queue", () => {
  it("sends a wrong answer to the back and asks it again", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await typeAndCheck(user, "wrong");
    await user.click(continueButton());
    expect(progress()).toHaveAttribute("aria-valuenow", "0");
    expect(screen.getByRole("heading", { name: "Typed b" })).toBeInTheDocument();
    await typeAndCheck(user, "isalnum");
    await user.click(continueButton());
    expect(screen.getByRole("heading", { name: "Typed a" })).toBeInTheDocument();
    expect(answerBox()).toHaveValue("");
  });

  it("keeps asking the last exercise until it's answered correctly", async () => {
    const user = start([typedItem("a")]);
    await typeAndCheck(user, "wrong");
    await user.click(continueButton());
    expect(screen.getByRole("heading", { name: "Typed a" })).toBeInTheDocument();
    await typeAndCheck(user, "isalnum");
    await user.click(continueButton());
    expect(screen.getByText("Training complete!")).toBeInTheDocument();
  });

  it("scrolls back to the top when moving on to the next exercise", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await typeAndCheck(user, "isalnum");
    expect(scrollToMock).not.toHaveBeenCalled();
    await user.click(continueButton());
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0 });
  });
});

describe("the results screen", () => {
  it("counts right-first-try answers and offers to train again or go back", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await typeAndCheck(user, "wrong");
    await user.click(continueButton());
    await typeAndCheck(user, "isalnum");
    await user.click(continueButton());
    await typeAndCheck(user, "isalnum");
    await user.click(continueButton());

    expect(screen.getByText("Training complete!")).toBeInTheDocument();
    expect(screen.getByText("Right on the first try").nextElementSibling).toHaveTextContent("1 / 2");
    expect(screen.getByText("Training doesn't count toward your streak.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to path" })).toHaveAttribute("href", "/patterns/1");
    await user.click(screen.getByRole("button", { name: /train again/i }));
    expect(router.refresh).toHaveBeenCalledTimes(1);
  });

  it("says nothing about mastery in a pattern mix", async () => {
    const user = start([typedItem("a")]);
    await typeAndCheck(user, "isalnum");
    await user.click(continueButton());
    expect(screen.queryByText(/master/i)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("sounds", () => {
  it("dings on a correct answer", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await typeAndCheck(user, "isalnum");
    expect(sounds.playCorrect).toHaveBeenCalledTimes(1);
    expect(sounds.playWrong).not.toHaveBeenCalled();
  });

  it("buzzes on a wrong answer, typed or picked", async () => {
    const user = start([typedItem("a"), choiceItem("c")]);
    await typeAndCheck(user, "wrong");
    await user.click(continueButton());
    await user.click(screen.getByRole("radio", { name: /wrong one/i }));
    await user.click(checkButton());
    expect(sounds.playWrong).toHaveBeenCalledTimes(2);
    expect(sounds.playCorrect).not.toHaveBeenCalled();
  });

  it("plays the fanfare once, when the last exercise is done", async () => {
    const user = start([typedItem("a"), typedItem("b")]);
    await typeAndCheck(user, "wrong");
    await user.click(continueButton());
    await typeAndCheck(user, "isalnum");
    await user.click(continueButton());
    await typeAndCheck(user, "isalnum");
    expect(sounds.playFanfare).not.toHaveBeenCalled();
    await user.click(continueButton());
    expect(screen.getByText("Training complete!")).toBeInTheDocument();
    expect(sounds.playFanfare).toHaveBeenCalledTimes(1);
  });
});

describe("mastery", () => {
  const mastery = { problemId: "p1", alreadyMastered: false };

  async function finish(user: ReturnType<typeof userEvent.setup>, answers: string[]) {
    for (const answer of answers) {
      await typeAndCheck(user, answer);
      await user.click(continueButton());
    }
  }

  it("is saved once after a perfect first-try run", async () => {
    const user = start([typedItem("a"), typedItem("b")], mastery);
    await finish(user, ["isalnum", "isalnum"]);
    expect(await screen.findByText("Mastered! This problem is now violet on your path.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("/api/problems/p1/master", { method: "POST" });
  });

  it("is not saved if any answer was wrong, even after a retry", async () => {
    const user = start([typedItem("a"), typedItem("b")], mastery);
    await finish(user, ["wrong", "isalnum", "isalnum"]);
    expect(screen.getByText("Get 10/10 on the first try to master this problem and turn it violet.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("isn't saved again for a problem that is already mastered", async () => {
    const user = start([typedItem("a")], { problemId: "p1", alreadyMastered: true });
    await finish(user, ["isalnum"]);
    expect(screen.getByText("Already mastered: this problem is violet on your path.")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("tells the user when saving fails", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ error: "boom" }, 500));
    const user = start([typedItem("a")], mastery);
    await finish(user, ["isalnum"]);
    expect(await screen.findByText(/couldn't be saved/)).toBeInTheDocument();
  });

  it("tells the user when the network is down", async () => {
    fetchMock.mockRejectedValue(new TypeError("offline"));
    const user = start([typedItem("a")], mastery);
    await finish(user, ["isalnum"]);
    await waitFor(() => expect(screen.getByText(/couldn't be saved/)).toBeInTheDocument());
  });
});
