export interface TeamMember {
  name: string
  role: string
}

export interface TeamComp {
  characterName: string
  teamLabel: string
  members: TeamMember[]
}

export const TeamComps: TeamComp[] = [
  // ── Limited 5-Star ──────────────────────────────────────────────────────────
  { characterName: 'Hiyuki', teamLabel: 'Team 1', members: [{ name: 'Hiyuki', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Chisa', role: 'Sub-DPS' }] },
  { characterName: 'Sigrika', teamLabel: 'Team 1', members: [{ name: 'Sigrika', role: 'Main DPS' }, { name: 'Qiuyuan', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Sub-DPS' }] },
  { characterName: 'Luuk Herssen', teamLabel: 'Team 1', members: [{ name: 'Luuk Herssen', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Mornye', role: 'Sub-DPS' }] },
  { characterName: 'Aemeath', teamLabel: 'Team 1', members: [{ name: 'Aemeath', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Mornye', role: 'Sub-DPS' }] },
  { characterName: 'Mornye', teamLabel: 'Team 1', members: [{ name: 'Aemeath', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Mornye', role: 'Sub-DPS' }] },
  { characterName: 'Lynae', teamLabel: 'Team 1', members: [{ name: 'Aemeath', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Mornye', role: 'Sub-DPS' }] },
  { characterName: 'Chisa', teamLabel: 'Team 1', members: [{ name: 'Cartethyia', role: 'Main DPS' }, { name: 'Ciaccona', role: 'Sub-DPS' }, { name: 'Chisa', role: 'Support' }] },
  { characterName: 'Qiuyuan', teamLabel: 'Team 1', members: [{ name: 'Galbrena', role: 'Main DPS' }, { name: 'Qiuyuan', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Qiuyuan', teamLabel: 'Team 2', members: [{ name: 'Phrolova', role: 'Main DPS' }, { name: 'Qiuyuan', role: 'Sub-DPS' }, { name: 'Cantarella', role: 'Sub-DPS' }] },
  { characterName: 'Galbrena', teamLabel: 'Team 1', members: [{ name: 'Galbrena', role: 'Main DPS' }, { name: 'Qiuyuan', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Sub-DPS' }] },
  { characterName: 'Iuno', teamLabel: 'Team 1', members: [{ name: 'Augusta', role: 'Main DPS' }, { name: 'Iuno', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Sub-DPS' }] },
  { characterName: 'Augusta', teamLabel: 'Team 1', members: [{ name: 'Augusta', role: 'Main DPS' }, { name: 'Iuno', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Sub-DPS' }] },
  { characterName: 'Phrolova', teamLabel: 'Team 1', members: [{ name: 'Phrolova', role: 'Main DPS' }, { name: 'Cantarella', role: 'Sub-DPS' }, { name: 'Qiuyuan', role: 'Sub-DPS' }] },
  { characterName: 'Lupa', teamLabel: 'Team 1', members: [{ name: 'Changli', role: 'Main DPS' }, { name: 'Brant', role: 'Main DPS' }, { name: 'Lupa', role: 'Sub-DPS' }] },
  { characterName: 'Cartethyia', teamLabel: 'Team 1', members: [{ name: 'Cartethyia', role: 'Main DPS' }, { name: 'Ciaccona', role: 'Sub-DPS' }, { name: 'Rover (Aero)', role: 'Support' }] },
  { characterName: 'Ciaccona', teamLabel: 'Team 1', members: [{ name: 'Cartethyia', role: 'Main DPS' }, { name: 'Ciaccona', role: 'Sub-DPS' }, { name: 'Rover (Aero)', role: 'Support' }] },
  { characterName: 'Zani', teamLabel: 'Team 1', members: [{ name: 'Zani', role: 'Main DPS' }, { name: 'Phoebe', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Cantarella', teamLabel: 'Team 1', members: [{ name: 'Phrolova', role: 'Main DPS' }, { name: 'Cantarella', role: 'Sub-DPS' }, { name: 'Qiuyuan', role: 'Sub-DPS' }] },
  { characterName: 'Brant', teamLabel: 'Team 1', members: [{ name: 'Brant', role: 'Main DPS' }, { name: 'Changli', role: 'Main DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Phoebe', teamLabel: 'Team 1', members: [{ name: 'Zani', role: 'Main DPS' }, { name: 'Phoebe', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Roccia', teamLabel: 'Team 1', members: [{ name: 'Camellya', role: 'Main DPS' }, { name: 'Roccia', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Carlotta', teamLabel: 'Team 1', members: [{ name: 'Carlotta', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Camellya', teamLabel: 'Team 1', members: [{ name: 'Camellya', role: 'Main DPS' }, { name: 'Roccia', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Shorekeeper', teamLabel: 'Team 1', members: [{ name: 'Jinhsi', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Zhezhi', teamLabel: 'Team 1', members: [{ name: 'Carlotta', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Xiangli Yao', teamLabel: 'Team 1', members: [{ name: 'Xiangli Yao', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Mornye', role: 'Support' }] },
  { characterName: 'Changli', teamLabel: 'Team 1', members: [{ name: 'Changli', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Jinhsi', teamLabel: 'Team 1', members: [{ name: 'Jinhsi', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Yinlin', teamLabel: 'Team 1', members: [{ name: 'Xiangli Yao', role: 'Main DPS' }, { name: 'Yinlin', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Jiyan', teamLabel: 'Team 1', members: [{ name: 'Jiyan', role: 'Main DPS' }, { name: 'Mortefi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  // ── Early Game ───────────────────────────────────────────────────────────────
  { characterName: 'Rover (Spectro)', teamLabel: 'Team 1', members: [{ name: 'Rover (Spectro)', role: 'Main DPS' }, { name: 'Chixia', role: 'Sub-DPS' }, { name: 'Yangyang', role: 'Sub-DPS' }] },
  // ── Standard 5-Star ─────────────────────────────────────────────────────────
  { characterName: 'Calcharo', teamLabel: 'Team 1', members: [{ name: 'Calcharo', role: 'Main DPS' }, { name: 'Lynae', role: 'Sub-DPS' }, { name: 'Mornye', role: 'Sub-DPS' }] },
  { characterName: 'Encore', teamLabel: 'Team 1', members: [{ name: 'Encore', role: 'Main DPS' }, { name: 'Changli', role: 'Main DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Jianxin', teamLabel: 'Team 1', members: [{ name: 'Calcharo', role: 'Main DPS' }, { name: 'Jianxin', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Lingyang', teamLabel: 'Team 1', members: [{ name: 'Lingyang', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Shorekeeper', role: 'Support' }] },
  { characterName: 'Verina', teamLabel: 'Team 1', members: [{ name: 'Jinhsi', role: 'Main DPS' }, { name: 'Zhezhi', role: 'Sub-DPS' }, { name: 'Verina', role: 'Support' }] },
]
