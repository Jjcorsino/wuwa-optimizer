import type Event from './Interfaces/Event'
import { Rarity } from './Enums/Rarity'
import { ReleaseState } from './Enums/ReleaseState'

function CreateDateInUserTimezone(dateString: string): Date {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: userTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const tempDate = new Date(dateString)
  const dateStringInTimezone = formatter.format(tempDate)
  return new Date(dateStringInTimezone)
}

export const Events: Event[] = [
  // ============================================================
  // Version 1.0
  // ============================================================

  // Phase 1 (2024-05-23 → 2024-06-13): Jiyan debut
  { Id: 'event-1.0-p1-jiyan', CharacterId: 1404, StartDate: CreateDateInUserTimezone('2024-05-23'), EndDate: CreateDateInUserTimezone('2024-06-13'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.0-p1-weapon', WeaponId: 21010016, StartDate: CreateDateInUserTimezone('2024-05-23'), EndDate: CreateDateInUserTimezone('2024-06-13'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2024-06-06 → 2024-06-26): Yinlin debut (overlapped with Phase 1 at launch)
  { Id: 'event-1.0-p2-yinlin', CharacterId: 1302, StartDate: CreateDateInUserTimezone('2024-06-06'), EndDate: CreateDateInUserTimezone('2024-06-26'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.0-p2-weapon', WeaponId: 21050016, StartDate: CreateDateInUserTimezone('2024-06-06'), EndDate: CreateDateInUserTimezone('2024-06-26'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 1.1
  // ============================================================

  // Phase 1 (2024-06-28 → 2024-07-22): Jinhsi debut
  { Id: 'event-1.1-p1-jinhsi', CharacterId: 1304, StartDate: CreateDateInUserTimezone('2024-06-28'), EndDate: CreateDateInUserTimezone('2024-07-22'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.1-p1-weapon', WeaponId: 21010026, StartDate: CreateDateInUserTimezone('2024-06-28'), EndDate: CreateDateInUserTimezone('2024-07-22'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2024-07-22 → 2024-08-14): Changli debut
  { Id: 'event-1.1-p2-changli', CharacterId: 1205, StartDate: CreateDateInUserTimezone('2024-07-22'), EndDate: CreateDateInUserTimezone('2024-08-14'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.1-p2-weapon', WeaponId: 21020016, StartDate: CreateDateInUserTimezone('2024-07-22'), EndDate: CreateDateInUserTimezone('2024-08-14'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 1.2
  // ============================================================

  // Phase 1 (2024-08-15 → 2024-09-07): Zhezhi debut
  { Id: 'event-1.2-p1-zhezhi', CharacterId: 1105, StartDate: CreateDateInUserTimezone('2024-08-15'), EndDate: CreateDateInUserTimezone('2024-09-07'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.2-p1-weapon', WeaponId: 21050026, StartDate: CreateDateInUserTimezone('2024-08-15'), EndDate: CreateDateInUserTimezone('2024-09-07'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2024-09-07 → 2024-09-28): Xiangli Yao debut
  { Id: 'event-1.2-p2-xiangli-yao', CharacterId: 1305, StartDate: CreateDateInUserTimezone('2024-09-07'), EndDate: CreateDateInUserTimezone('2024-09-28'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.2-p2-weapon', WeaponId: 21040016, StartDate: CreateDateInUserTimezone('2024-09-07'), EndDate: CreateDateInUserTimezone('2024-09-28'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 1.3
  // ============================================================

  // Phase 1 (2024-09-29 → 2024-10-24): Shorekeeper debut
  { Id: 'event-1.3-p1-shorekeeper', CharacterId: 1505, StartDate: CreateDateInUserTimezone('2024-09-29'), EndDate: CreateDateInUserTimezone('2024-10-24'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.3-p1-weapon', WeaponId: 21050036, StartDate: CreateDateInUserTimezone('2024-09-29'), EndDate: CreateDateInUserTimezone('2024-10-24'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2024-10-24 → 2024-11-13): Jiyan rerun
  { Id: 'event-1.3-p2-jiyan', CharacterId: 1404, StartDate: CreateDateInUserTimezone('2024-10-24'), EndDate: CreateDateInUserTimezone('2024-11-13'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.3-p2-weapon', WeaponId: 21010016, StartDate: CreateDateInUserTimezone('2024-10-24'), EndDate: CreateDateInUserTimezone('2024-11-13'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 1.4
  // ============================================================

  // Phase 1 (2024-11-14 → 2024-12-12): Camellya debut
  { Id: 'event-1.4-p1-camellya', CharacterId: 1603, StartDate: CreateDateInUserTimezone('2024-11-14'), EndDate: CreateDateInUserTimezone('2024-12-12'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.4-p1-weapon', WeaponId: 21020026, StartDate: CreateDateInUserTimezone('2024-11-14'), EndDate: CreateDateInUserTimezone('2024-12-12'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2024-12-12 → 2025-01-01): Yinlin + Xiangli Yao reruns
  { Id: 'event-1.4-p2-yinlin', CharacterId: 1302, StartDate: CreateDateInUserTimezone('2024-12-12'), EndDate: CreateDateInUserTimezone('2025-01-01'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.4-p2-xiangli-yao', CharacterId: 1305, StartDate: CreateDateInUserTimezone('2024-12-12'), EndDate: CreateDateInUserTimezone('2025-01-01'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-1.4-p2-weapon', WeaponId: 21050016, StartDate: CreateDateInUserTimezone('2024-12-12'), EndDate: CreateDateInUserTimezone('2025-01-01'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.0
  // ============================================================

  // Phase 1 (2025-01-02 → 2025-01-23): Carlotta debut + Zhezhi rerun
  { Id: 'event-2.0-p1-carlotta', CharacterId: 1107, StartDate: CreateDateInUserTimezone('2025-01-02'), EndDate: CreateDateInUserTimezone('2025-01-23'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.0-p1-zhezhi', CharacterId: 1105, StartDate: CreateDateInUserTimezone('2025-01-02'), EndDate: CreateDateInUserTimezone('2025-01-23'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.0-p1-weapon', WeaponId: 21030016, StartDate: CreateDateInUserTimezone('2025-01-02'), EndDate: CreateDateInUserTimezone('2025-01-23'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-01-23 → 2025-02-12): Roccia debut + Jinhsi rerun
  { Id: 'event-2.0-p2-roccia', CharacterId: 1606, StartDate: CreateDateInUserTimezone('2025-01-23'), EndDate: CreateDateInUserTimezone('2025-02-12'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.0-p2-jinhsi', CharacterId: 1304, StartDate: CreateDateInUserTimezone('2025-01-23'), EndDate: CreateDateInUserTimezone('2025-02-12'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.0-p2-weapon', WeaponId: 21040026, StartDate: CreateDateInUserTimezone('2025-01-23'), EndDate: CreateDateInUserTimezone('2025-02-12'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.1
  // ============================================================

  // Phase 1 (2025-02-13 → 2025-03-06): Phoebe debut
  { Id: 'event-2.1-p1-phoebe', CharacterId: 1506, StartDate: CreateDateInUserTimezone('2025-02-13'), EndDate: CreateDateInUserTimezone('2025-03-06'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.1-p1-weapon', WeaponId: 21050046, StartDate: CreateDateInUserTimezone('2025-02-13'), EndDate: CreateDateInUserTimezone('2025-03-06'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-03-06 → 2025-03-26): Brant debut + Changli rerun
  { Id: 'event-2.1-p2-brant', CharacterId: 1206, StartDate: CreateDateInUserTimezone('2025-03-06'), EndDate: CreateDateInUserTimezone('2025-03-26'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.1-p2-changli', CharacterId: 1205, StartDate: CreateDateInUserTimezone('2025-03-06'), EndDate: CreateDateInUserTimezone('2025-03-26'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.1-p2-weapon', WeaponId: 21020036, StartDate: CreateDateInUserTimezone('2025-03-06'), EndDate: CreateDateInUserTimezone('2025-03-26'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.2
  // ============================================================

  // Phase 1 (2025-03-27 → 2025-04-17): Cantarella debut + Camellya rerun
  { Id: 'event-2.2-p1-cantarella', CharacterId: 1607, StartDate: CreateDateInUserTimezone('2025-03-27'), EndDate: CreateDateInUserTimezone('2025-04-17'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.2-p1-camellya', CharacterId: 1603, StartDate: CreateDateInUserTimezone('2025-03-27'), EndDate: CreateDateInUserTimezone('2025-04-17'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.2-p1-weapon', WeaponId: 21050056, StartDate: CreateDateInUserTimezone('2025-03-27'), EndDate: CreateDateInUserTimezone('2025-04-17'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-04-17 → 2025-04-28): Shorekeeper rerun
  { Id: 'event-2.2-p2-shorekeeper', CharacterId: 1505, StartDate: CreateDateInUserTimezone('2025-04-17'), EndDate: CreateDateInUserTimezone('2025-04-28'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.2-p2-weapon', WeaponId: 21050036, StartDate: CreateDateInUserTimezone('2025-04-17'), EndDate: CreateDateInUserTimezone('2025-04-28'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.3 (1st Anniversary)
  // ============================================================

  // Phase 1 (2025-04-29 → 2025-05-22): Zani debut
  { Id: 'event-2.3-p1-zani', CharacterId: 1507, StartDate: CreateDateInUserTimezone('2025-04-29'), EndDate: CreateDateInUserTimezone('2025-05-22'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.3-p1-weapon', WeaponId: 21040036, StartDate: CreateDateInUserTimezone('2025-04-29'), EndDate: CreateDateInUserTimezone('2025-05-22'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-05-22 → 2025-06-11): Ciaccona debut
  { Id: 'event-2.3-p2-ciaccona', CharacterId: 1407, StartDate: CreateDateInUserTimezone('2025-05-22'), EndDate: CreateDateInUserTimezone('2025-06-11'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.3-p2-weapon', WeaponId: 21030026, StartDate: CreateDateInUserTimezone('2025-05-22'), EndDate: CreateDateInUserTimezone('2025-06-11'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.4
  // ============================================================

  // Phase 1 (2025-06-12 → 2025-07-03): Cartethyia debut
  { Id: 'event-2.4-p1-cartethyia', CharacterId: 1409, StartDate: CreateDateInUserTimezone('2025-06-12'), EndDate: CreateDateInUserTimezone('2025-07-03'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.4-p1-weapon', WeaponId: 21020056, StartDate: CreateDateInUserTimezone('2025-06-12'), EndDate: CreateDateInUserTimezone('2025-07-03'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-07-03 → 2025-07-23): Lupa debut
  { Id: 'event-2.4-p2-lupa', CharacterId: 1207, StartDate: CreateDateInUserTimezone('2025-07-03'), EndDate: CreateDateInUserTimezone('2025-07-23'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.4-p2-weapon', WeaponId: 21010036, StartDate: CreateDateInUserTimezone('2025-07-03'), EndDate: CreateDateInUserTimezone('2025-07-23'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.5
  // ============================================================

  // Phase 1 (2025-07-24 → 2025-08-14): Phrolova debut + Roccia rerun
  { Id: 'event-2.5-p1-phrolova', CharacterId: 1608, StartDate: CreateDateInUserTimezone('2025-07-24'), EndDate: CreateDateInUserTimezone('2025-08-14'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.5-p1-roccia', CharacterId: 1606, StartDate: CreateDateInUserTimezone('2025-07-24'), EndDate: CreateDateInUserTimezone('2025-08-14'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.5-p1-weapon', WeaponId: 21050066, StartDate: CreateDateInUserTimezone('2025-07-24'), EndDate: CreateDateInUserTimezone('2025-08-14'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-08-14 → 2025-08-27): Cantarella + Brant reruns
  { Id: 'event-2.5-p2-cantarella', CharacterId: 1607, StartDate: CreateDateInUserTimezone('2025-08-14'), EndDate: CreateDateInUserTimezone('2025-08-27'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.5-p2-brant', CharacterId: 1206, StartDate: CreateDateInUserTimezone('2025-08-14'), EndDate: CreateDateInUserTimezone('2025-08-27'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.5-p2-weapon', WeaponId: 21050056, StartDate: CreateDateInUserTimezone('2025-08-14'), EndDate: CreateDateInUserTimezone('2025-08-27'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.6
  // ============================================================

  // Phase 1 (2025-08-28 → 2025-09-17): Augusta debut + Carlotta + Shorekeeper reruns
  { Id: 'event-2.6-p1-augusta', CharacterId: 9901, StartDate: CreateDateInUserTimezone('2025-08-28'), EndDate: CreateDateInUserTimezone('2025-09-17'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.6-p1-carlotta', CharacterId: 1107, StartDate: CreateDateInUserTimezone('2025-08-28'), EndDate: CreateDateInUserTimezone('2025-09-17'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.6-p1-shorekeeper', CharacterId: 1505, StartDate: CreateDateInUserTimezone('2025-08-28'), EndDate: CreateDateInUserTimezone('2025-09-17'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.6-p1-weapon', WeaponId: 21010105, StartDate: CreateDateInUserTimezone('2025-08-28'), EndDate: CreateDateInUserTimezone('2025-09-17'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-09-17 → 2025-10-08): Iuno debut + Ciaccona rerun
  { Id: 'event-2.6-p2-iuno', CharacterId: 9902, StartDate: CreateDateInUserTimezone('2025-09-17'), EndDate: CreateDateInUserTimezone('2025-10-08'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.6-p2-ciaccona', CharacterId: 1407, StartDate: CreateDateInUserTimezone('2025-09-17'), EndDate: CreateDateInUserTimezone('2025-10-08'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.6-p2-weapon', WeaponId: 21040105, StartDate: CreateDateInUserTimezone('2025-09-17'), EndDate: CreateDateInUserTimezone('2025-10-08'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.7
  // ============================================================

  // Phase 1 (2025-10-09 → 2025-10-30): Galbrena debut + Lupa rerun
  { Id: 'event-2.7-p1-galbrena', CharacterId: 9903, StartDate: CreateDateInUserTimezone('2025-10-09'), EndDate: CreateDateInUserTimezone('2025-10-30'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.7-p1-lupa', CharacterId: 1207, StartDate: CreateDateInUserTimezone('2025-10-09'), EndDate: CreateDateInUserTimezone('2025-10-30'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.7-p1-weapon', WeaponId: 21030105, StartDate: CreateDateInUserTimezone('2025-10-09'), EndDate: CreateDateInUserTimezone('2025-10-30'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-10-30 → 2025-11-19): Qiuyuan debut + Zani rerun
  { Id: 'event-2.7-p2-qiuyuan', CharacterId: 9904, StartDate: CreateDateInUserTimezone('2025-10-30'), EndDate: CreateDateInUserTimezone('2025-11-19'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.7-p2-zani', CharacterId: 1507, StartDate: CreateDateInUserTimezone('2025-10-30'), EndDate: CreateDateInUserTimezone('2025-11-19'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.7-p2-weapon', WeaponId: 21020105, StartDate: CreateDateInUserTimezone('2025-10-30'), EndDate: CreateDateInUserTimezone('2025-11-19'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 2.8
  // ============================================================

  // Phase 1 (2025-11-20 → 2025-12-11): Chisa debut + Phoebe rerun
  { Id: 'event-2.8-p1-chisa', CharacterId: 9905, StartDate: CreateDateInUserTimezone('2025-11-20'), EndDate: CreateDateInUserTimezone('2025-12-11'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.8-p1-phoebe', CharacterId: 1506, StartDate: CreateDateInUserTimezone('2025-11-20'), EndDate: CreateDateInUserTimezone('2025-12-11'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.8-p1-weapon', WeaponId: 21010106, StartDate: CreateDateInUserTimezone('2025-11-20'), EndDate: CreateDateInUserTimezone('2025-12-11'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2025-12-11 → 2025-12-24): Phrolova + Cantarella reruns
  { Id: 'event-2.8-p2-phrolova', CharacterId: 1608, StartDate: CreateDateInUserTimezone('2025-12-11'), EndDate: CreateDateInUserTimezone('2025-12-24'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.8-p2-cantarella', CharacterId: 1607, StartDate: CreateDateInUserTimezone('2025-12-11'), EndDate: CreateDateInUserTimezone('2025-12-24'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-2.8-p2-weapon', WeaponId: 21050066, StartDate: CreateDateInUserTimezone('2025-12-11'), EndDate: CreateDateInUserTimezone('2025-12-24'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 3.0
  // ============================================================

  // Phase 1 (2025-12-25 → 2026-01-15): Lynae debut + Cartethyia + Ciaccona reruns
  { Id: 'event-3.0-p1-lynae', CharacterId: 9912, StartDate: CreateDateInUserTimezone('2025-12-25'), EndDate: CreateDateInUserTimezone('2026-01-15'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.0-p1-cartethyia', CharacterId: 1409, StartDate: CreateDateInUserTimezone('2025-12-25'), EndDate: CreateDateInUserTimezone('2026-01-15'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.0-p1-ciaccona', CharacterId: 1407, StartDate: CreateDateInUserTimezone('2025-12-25'), EndDate: CreateDateInUserTimezone('2026-01-15'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.0-p1-weapon', WeaponId: 21030106, StartDate: CreateDateInUserTimezone('2025-12-25'), EndDate: CreateDateInUserTimezone('2026-01-15'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2026-01-15 → 2026-02-04): Mornye debut + Augusta + Iuno reruns
  { Id: 'event-3.0-p2-mornye', CharacterId: 9908, StartDate: CreateDateInUserTimezone('2026-01-15'), EndDate: CreateDateInUserTimezone('2026-02-04'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.0-p2-augusta', CharacterId: 9901, StartDate: CreateDateInUserTimezone('2026-01-15'), EndDate: CreateDateInUserTimezone('2026-02-04'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.0-p2-iuno', CharacterId: 9902, StartDate: CreateDateInUserTimezone('2026-01-15'), EndDate: CreateDateInUserTimezone('2026-02-04'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.0-p2-weapon', WeaponId: 21010107, StartDate: CreateDateInUserTimezone('2026-01-15'), EndDate: CreateDateInUserTimezone('2026-02-04'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 3.1
  // ============================================================

  // Phase 1 (2026-02-05 → 2026-02-26): Aemeath debut + Chisa + Lupa reruns
  { Id: 'event-3.1-p1-aemeath', CharacterId: 9909, StartDate: CreateDateInUserTimezone('2026-02-05'), EndDate: CreateDateInUserTimezone('2026-02-26'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.1-p1-chisa', CharacterId: 9905, StartDate: CreateDateInUserTimezone('2026-02-05'), EndDate: CreateDateInUserTimezone('2026-02-26'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.1-p1-lupa', CharacterId: 1207, StartDate: CreateDateInUserTimezone('2026-02-05'), EndDate: CreateDateInUserTimezone('2026-02-26'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.1-p1-weapon', WeaponId: 21010036, StartDate: CreateDateInUserTimezone('2026-02-05'), EndDate: CreateDateInUserTimezone('2026-02-26'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2026-02-26 → 2026-03-18): Luuk Herssen debut + Galbrena rerun
  { Id: 'event-3.1-p2-luuk-herssen', CharacterId: 9913, StartDate: CreateDateInUserTimezone('2026-02-26'), EndDate: CreateDateInUserTimezone('2026-03-18'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.1-p2-galbrena', CharacterId: 9903, StartDate: CreateDateInUserTimezone('2026-02-26'), EndDate: CreateDateInUserTimezone('2026-03-18'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.1-p2-weapon', WeaponId: 21030105, StartDate: CreateDateInUserTimezone('2026-02-26'), EndDate: CreateDateInUserTimezone('2026-03-18'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 3.2
  // ============================================================

  // Phase 1 (2026-03-19 → 2026-04-09): Sigrika debut + Qiuyuan rerun
  { Id: 'event-3.2-p1-sigrika', CharacterId: 9911, StartDate: CreateDateInUserTimezone('2026-03-19'), EndDate: CreateDateInUserTimezone('2026-04-09'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.2-p1-qiuyuan', CharacterId: 9904, StartDate: CreateDateInUserTimezone('2026-03-19'), EndDate: CreateDateInUserTimezone('2026-04-09'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.2-p1-weapon', WeaponId: 21040106, StartDate: CreateDateInUserTimezone('2026-03-19'), EndDate: CreateDateInUserTimezone('2026-04-09'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2026-04-09 → 2026-04-29): Lynae + Zani + Phoebe reruns
  { Id: 'event-3.2-p2-lynae', CharacterId: 9912, StartDate: CreateDateInUserTimezone('2026-04-09'), EndDate: CreateDateInUserTimezone('2026-04-29'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.2-p2-zani', CharacterId: 1507, StartDate: CreateDateInUserTimezone('2026-04-09'), EndDate: CreateDateInUserTimezone('2026-04-29'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.2-p2-phoebe', CharacterId: 1506, StartDate: CreateDateInUserTimezone('2026-04-09'), EndDate: CreateDateInUserTimezone('2026-04-29'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.2-p2-weapon', WeaponId: 21030106, StartDate: CreateDateInUserTimezone('2026-04-09'), EndDate: CreateDateInUserTimezone('2026-04-29'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // ============================================================
  // Version 3.3 — CURRENT
  // ============================================================

  // Phase 1 (2026-04-30 → 2026-05-21): Hiyuki debut + Mornye + Iuno reruns
  { Id: 'event-3.3-p1-hiyuki', CharacterId: 9906, StartDate: CreateDateInUserTimezone('2026-04-30'), EndDate: CreateDateInUserTimezone('2026-05-21'), ReleaseState: ReleaseState.NEW, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p1-mornye', CharacterId: 9908, StartDate: CreateDateInUserTimezone('2026-04-30'), EndDate: CreateDateInUserTimezone('2026-05-21'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p1-iuno', CharacterId: 9902, StartDate: CreateDateInUserTimezone('2026-04-30'), EndDate: CreateDateInUserTimezone('2026-05-21'), ReleaseState: ReleaseState.RELEASED, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p1-weapon-frostburn', WeaponId: 21020106, StartDate: CreateDateInUserTimezone('2026-04-30'), EndDate: CreateDateInUserTimezone('2026-05-21'), ReleaseState: ReleaseState.NEW, Type: 'weapon', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p1-weapon-starfield', WeaponId: 21010107, StartDate: CreateDateInUserTimezone('2026-04-30'), EndDate: CreateDateInUserTimezone('2026-05-21'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p1-weapon-moongazer', WeaponId: 21040105, StartDate: CreateDateInUserTimezone('2026-04-30'), EndDate: CreateDateInUserTimezone('2026-05-21'), ReleaseState: ReleaseState.RELEASED, Type: 'weapon', Rarity: Rarity.FIVE_STARS },

  // Phase 2 (2026-05-21 → 2026-06-11): Denia debut + Chisa + Phrolova reruns
  { Id: 'event-3.3-p2-denia', CharacterId: 9907, StartDate: CreateDateInUserTimezone('2026-05-21'), EndDate: CreateDateInUserTimezone('2026-06-11'), ReleaseState: ReleaseState.UPCOMING, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p2-chisa', CharacterId: 9905, StartDate: CreateDateInUserTimezone('2026-05-21'), EndDate: CreateDateInUserTimezone('2026-06-11'), ReleaseState: ReleaseState.UPCOMING, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p2-phrolova', CharacterId: 1608, StartDate: CreateDateInUserTimezone('2026-05-21'), EndDate: CreateDateInUserTimezone('2026-06-11'), ReleaseState: ReleaseState.UPCOMING, Type: 'character', Rarity: Rarity.FIVE_STARS },
  { Id: 'event-3.3-p2-weapon-forged-dwarf-star', WeaponId: 21050105, StartDate: CreateDateInUserTimezone('2026-05-21'), EndDate: CreateDateInUserTimezone('2026-06-11'), ReleaseState: ReleaseState.UPCOMING, Type: 'weapon', Rarity: Rarity.FIVE_STARS },
]

export function GetCurrentEvents(): Event[] {
  return Events.filter(event => event.ReleaseState === ReleaseState.NEW)
}

export function GetUpcomingEvents(): Event[] {
  return Events.filter(event => event.ReleaseState === ReleaseState.UPCOMING)
}

export function GetAvailableEvents(): Event[] {
  return Events.filter(event => event.ReleaseState === ReleaseState.RELEASED)
}

export function GetEventById(id: string): Event | undefined {
  return Events.find(event => event.Id === id)
}

export function GetEventByCharacterId(characterId: number): Event | undefined {
  return Events.find(event => event.CharacterId === characterId)
}
