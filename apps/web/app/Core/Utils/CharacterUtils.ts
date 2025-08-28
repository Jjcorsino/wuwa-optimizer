import type Character from "../Interfaces/Character"
import type { AnimatedArt } from "../Interfaces/Character"
import type Sequence from "../Interfaces/Sequence"
import { CharacterType } from "../Enums/CharacterType"
import { Rarity } from "../Enums/Rarity"
import { WeaponType } from "../Enums/WeaponType"

export function GetCharacterIcon(characterId: number) {
  return `/characters/${characterId}/images/Icon.webp`
}

export function GetRarityIcon(character: Character) {
  const basePath = "/images/icons/"

  switch (character.Rarity) {
    case Rarity.FIVE_STARS:
      return `${basePath}Icon_5_Stars.webp`
    case Rarity.FOUR_STARS:
      return `${basePath}Icon_4_Stars.webp`
    case Rarity.THREE_STARS:
      return `${basePath}Icon_3_Stars.webp`
    default:
      return `${basePath}Icon_2_Stars.webp`
  }
}

export function GetCharacterWeaponTypeIcon(character: Character) {
  const basePath = "/images/icons/"

  switch (character.WeaponType) {
    case WeaponType.PISTOLS:
      return `${basePath}Icon_Pistols.webp`
    case WeaponType.BROADBLADE:
      return `${basePath}Icon_Broadblade.webp`
    case WeaponType.SWORD:
      return `${basePath}Icon_Sword.webp`
    case WeaponType.RECTIFIER:
      return `${basePath}Icon_Rectifier.webp`
    case WeaponType.GAUNTLETS:
      return `${basePath}Icon_Gauntlets.webp`
  }
}

export function GetSequenceLevel(character: Character) {
  return character.Sequences.filter(s => s.Unlocked === true).length ?? 0
}

export function GetSequenceIcon(characterId: number, sequenceIndex: number) {
  return `/characters/${characterId}/images/${sequenceIndex.toString().padStart(2, "0")}.webp`
}

export function GetCharacterTypeIcon(character: Character) {
  const basePath = "/images/icons/"

  switch (character.Type) {
    case CharacterType.GLACIO:
      return `${basePath}Glacio.webp`
    case CharacterType.SPECTRO:
      return `${basePath}Spectro.webp`
    case CharacterType.HAVOC:
      return `${basePath}Havoc.webp`
    case CharacterType.FUSION:
      return `${basePath}Fusion.webp`
    case CharacterType.AERO:
      return `${basePath}Aero.webp`
    case CharacterType.ELECTRO:
      return `${basePath}Electro.webp`
    default:
      return "None"
  }
}

// TODO: Use a unified splash art path, only based on the character id.
export function GetSplashArt(characterId: number) {
  return `/characters/${characterId}/images/SplashArt.webp`
}

export function GetCharacterBackground(characterId: number) {
  return `/characters/${characterId}/images/Background.webp`
}

export function GetCharacterAnimatedArt(character: Character): AnimatedArt {
  return {
    Skeleton: `/characters/${character.Id}/animated/${character.AnimatedArt?.Skeleton}`,
    Atlas: `/characters/${character.Id}/animated/${character.AnimatedArt?.Atlas}`,
    OffsetX: character.AnimatedArt?.OffsetX ?? 0,
    OffsetY: character.AnimatedArt?.OffsetY ?? 0,
    Scale: character.AnimatedArt?.Scale ?? 1,
  }
}

export function HasAnimatedArt(character: Character) {
  return character.AnimatedArt !== undefined
}
