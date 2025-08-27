# Inštalácia Inventory Management System

## Rýchla inštalácia

### Krok 1: Stiahnite a rozbaľte aplikáciu
1. Stiahnite súbory aplikácie do priečinka
2. Rozbaľte súbory (ak sú v ZIP súbore)

### Krok 2: Spustite inštalátor
Máte dve možnosti:

#### Možnosť A: PowerShell inštalátor (odporúčané)
1. Kliknite pravým tlačidlom myši na `install.ps1`
2. Vyberte "Spustiť pomocou PowerShell"
3. Ak sa zobrazí varovanie o bezpečnosti, kliknite "Áno"

#### Možnosť B: Batch inštalátor
1. Dvojitým kliknutím spustite `install.bat`
2. Počkajte na dokončenie inštalácie

### Krok 3: Spustite aplikáciu
Po úspešnej inštalácii môžete aplikáciu spustiť:
1. **Skratka na ploche**: Dvojitým kliknutím na "Inventory Management"
2. **Spúšťací script**: Dvojitým kliknutím na `launch.bat`
3. **Príkazový riadok**: `npm start`

## Požiadavky

### Node.js
- **Stiahnite z**: https://nodejs.org/
- **Odporúčaná verzia**: 18.x alebo novšia
- **Inštalácia**: Spustite stiahnutý inštalátor a postupujte podľa pokynov

### npm
- Automaticky sa nainštaluje s Node.js
- Ak nie je k dispozícii, preinštalujte Node.js

## Riešenie problémov

### Chyba: "Node.js is not recognized"
**Riešenie**: 
1. Nainštalujte Node.js z https://nodejs.org/
2. Reštartujte počítač
3. Spustite inštalátor znova

### Chyba: "npm is not recognized"
**Riešenie**:
1. Preinštalujte Node.js
2. Uistite sa, že ste zaškrtli "Add to PATH" počas inštalácie

### Chyba: "Failed to install dependencies"
**Riešenie**:
1. Skontrolujte internetové pripojenie
2. Skúste spustiť `npm cache clean --force`
3. Spustite inštalátor znova

### Chyba: "Could not create desktop shortcut"
**Riešenie**:
1. Spustite PowerShell ako správca
2. Spustite: `Set-ExecutionPolicy RemoteSigned`
3. Spustite inštalátor znova

### Aplikácia sa nespúšťa
**Riešenie**:
1. Otvorte príkazový riadok v priečinku aplikácie
2. Spustite: `npm install`
3. Potom: `npm start`

## Manuálna inštalácia

Ak automatické inštalátory nefungujú:

1. **Otvorte príkazový riadok** v priečinku aplikácie
2. **Nainštalujte závislosti**:
   ```bash
   npm install
   ```
3. **Spustite aplikáciu**:
   ```bash
   npm start
   ```

## Štruktúra súborov

```
inventory-management-app/
├── install.bat          # Windows batch inštalátor
├── install.ps1          # PowerShell inštalátor
├── launch.bat           # Spúšťací script
├── package.json         # Konfigurácia projektu
├── main.js             # Hlavný Electron proces
├── index.html          # Hlavné okno aplikácie
├── database/           # SQLite databáza
├── styles/             # CSS štýly
├── scripts/            # JavaScript súbory
└── assets/             # Ikony a obrázky
```

## Odinštalácia

1. **Vymažte priečinok** aplikácie
2. **Odstráňte skratku** z plochy
3. **Vymažte databázu** (ak chcete): `database/inventory.db`

## Podpora

Ak máte problémy s inštaláciou:
1. Skontrolujte, či máte nainštalovaný Node.js
2. Skúste manuálnu inštaláciu
3. Skontrolujte chybové hlásenia v príkazovom riadku

---

**Poznámka**: Táto aplikácia používa lokálnu SQLite databázu. Všetky dáta sa ukladajú v priečinku `database/`. Pravidelne zálohujte súbor `database/inventory.db`.

