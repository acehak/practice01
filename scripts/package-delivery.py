"""Package the built app for delivery through the selected repository."""
from pathlib import Path
import hashlib
import shutil
import zipfile

root = Path(__file__).resolve().parents[1]
source = root / 'dist/gyeol-consult.html'
destination = root / 'deliverables'
destination.mkdir(exist_ok=True)
html = destination / 'gyeol-consult.html'
shutil.copyfile(source, html)
instructions = '''결 · 피부 상담 프로그램 v0.3

1. ZIP 압축을 풀어 주세요.
2. gyeol-consult.html 파일을 Chrome 또는 Edge에서 열어 주세요.
3. [예시 상담 보기]로 가상의 상담 흐름을 확인하세요.
4. [새 상담 시작]을 누르고 실제 상담을 시작하세요.

별도 설치나 서버 없이 사용하는 단일 HTML 프로그램입니다.
상담 내용은 자동 저장되지 않습니다. 새로고침하거나 창을 닫기 전에
[상담 요약]에서 복사 또는 인쇄/PDF로 필요한 기록을 남겨 주세요.

처짐 추천은 의사가 확인한 원인에 따른 병원 상담 기준입니다.
- 근막층 처짐·이완: 울쎄라피 프라임
- 유지인대 지지 저하: 티타늄
- 지방 볼륨 과다: 온다
확인된 처짐 원인을 여러 개 선택할 수 있습니다.
기본 플랜: 각각의 원인에 대한 시술 후보를 따로 보여줍니다.
확장 플랜: 복수 원인에 맞춘 조합 후보를 보여줍니다.
예) 근막층 + 유지인대: 울쎄라피 프라임 + 티타늄
예) 근막층 + 지방 과다: 울쎄라피 프라임 + 온다

피부 탄력·잔주름은 써마지 FLX와 소프웨이브를 대안 후보로 검토합니다.
더 짙은 정적 주름을 선택하면 소프웨이브를 우선 표시합니다.
확장 플랜의 [의료진이 직접 조합하기]에서 기본·확장 시술 후보 2개 이상을
선택하면 피부 탄력·처짐 등 서로 다른 항목의 조합도 검토할 수 있습니다.
위 순서는 병원 상담 선호 기준입니다. 부위와 시행 순서는 의료진이 결정합니다.
이는 장비 기전·효과를 확정하는 진단이나 보편적인 치료 지침이 아닙니다.
'''
(destination / '사용방법.txt').write_text(instructions, encoding='utf-8')
archive = destination / 'gyeol-consult-v3.zip'
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
    bundle.write(html, arcname='gyeol-consult.html')
    bundle.writestr('사용방법.txt', instructions)
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert bundle.read('gyeol-consult.html') == source.read_bytes()
digest = hashlib.sha256(html.read_bytes()).hexdigest()
(destination / 'SHA256SUMS.txt').write_text(f'{digest}  gyeol-consult.html\n', encoding='utf-8')
print(f'Delivery bundle verified: {archive} ({archive.stat().st_size:,} bytes)')
