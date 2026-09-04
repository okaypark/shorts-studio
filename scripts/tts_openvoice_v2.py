"""Register a consented reference voice and apply it to an existing base WAV."""
from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHECKPOINTS = ROOT / "third_party" / "OpenVoice" / "checkpoints_v2"


def profile_path(profile: str) -> Path:
    return ROOT / "voice_profiles" / profile / "se.pth"


def converter():
    from openvoice.api import ToneColorConverter

    config = CHECKPOINTS / "converter" / "config.json"
    checkpoint = CHECKPOINTS / "converter" / "checkpoint.pth"
    if not config.is_file() or not checkpoint.is_file():
        raise FileNotFoundError("OpenVoice V2 converter checkpoint is missing under third_party/OpenVoice/checkpoints_v2.")
    item = ToneColorConverter(str(config), device="cuda:0" if __import__("torch").cuda.is_available() else "cpu")
    item.load_ckpt(str(checkpoint))
    return item


def register(args: argparse.Namespace) -> None:
    reference = Path(args.reference).resolve()
    if not reference.is_file():
        raise FileNotFoundError(f"Reference audio not found: {reference}")
    output = profile_path(args.profile)
    output.parent.mkdir(parents=True, exist_ok=True)
    # A clean 10–30 second single-speaker file does not need Whisper/VAD splitting.
    # This keeps Windows setup free of the optional video-transcription dependency.
    converter().extract_se([str(reference)], se_save_path=str(output))
    print(f"Registered voice profile: {args.profile}")


def synthesize(args: argparse.Namespace) -> None:
    import torch

    base = Path(args.base).resolve()
    output = Path(args.output).resolve()
    target = profile_path(args.profile)
    source = CHECKPOINTS / "base_speakers" / "ses" / "kr.pth"
    if not base.is_file() or not target.is_file() or not source.is_file():
        raise FileNotFoundError("Base WAV, registered profile, or Korean source embedding is missing.")
    output.parent.mkdir(parents=True, exist_ok=True)
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    source_se = torch.load(source, map_location=device)
    target_se = torch.load(target, map_location=device)
    converter().convert(
        audio_src_path=str(base), src_se=source_se, tgt_se=target_se, output_path=str(output), message="@shorts-studio",
    )
    print(f"Synthesized: {output}")


def check(args: argparse.Namespace) -> None:
    if not profile_path(args.profile).is_file():
        raise FileNotFoundError(f"Voice profile not registered: {args.profile}")
    converter()
    print("OpenVoice V2 is ready")


parser = argparse.ArgumentParser()
sub = parser.add_subparsers(dest="command", required=True)
for command in ("register", "synthesize", "check"):
    item = sub.add_parser(command)
    item.add_argument("--profile", required=True)
    if command == "register":
        item.add_argument("--reference", required=True)
    if command == "synthesize":
        item.add_argument("--base", required=True)
        item.add_argument("--output", required=True)

args = parser.parse_args()
{"register": register, "synthesize": synthesize, "check": check}[args.command](args)
