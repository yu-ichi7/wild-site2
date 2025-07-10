import pandas as pd
import json

# --- 設定 ---
EXCEL_FILE_PATH = 'birds_data.xlsx' # 読み込むExcelファイル名
JSON_FILE_PATH = 'birds.json'       # 出力するJSONファイル名
SHEET_NAME = 'birds'                # Excelシート名
# ------------

def create_json_from_excel():
    """Excelファイルを読み込み、ウェブサイト用のJSONファイルを生成します。"""
    try:
        # ExcelファイルをPandasのDataFrameとして読み込む
        df = pd.read_excel(EXCEL_FILE_PATH, sheet_name=SHEET_NAME)
    except FileNotFoundError:
        print(f"エラー: '{EXCEL_FILE_PATH}' が見つかりません。ファイル名と場所を確認してください。")
        return
    except Exception as e:
        print(f"Excelファイルの読み込み中にエラーが発生しました: {e}")
        return

    # NaN（空のセル）をNoneに置き換え、その後空の文字列に変換する
    df = df.fillna('').astype(str)

    birds_list = []
    # DataFrameの各行をループ処理
    for index, row in df.iterrows():
        # descriptions（説明文）を解析
        descriptions = []
        if row['descriptions']:
            desc_pairs = row['descriptions'].split('|')
            for pair in desc_pairs:
                if '::' in pair:
                    title, text = pair.split('::', 1)
                    descriptions.append({'title': title.strip(), 'text': text.strip()})

        # 各鳥のデータを辞書として構築
        bird_data = {
            'id': row['id'],
            'nameJP': row['nameJP'],
            'nameEN': row['nameEN'],
            'nameSCI': row['nameSCI'],
            'mainImage': row['mainImage'],
            'detailImages': [img.strip() for img in row['detailImages'].split(',') if img.strip()],
            'descriptions': descriptions
        }
        birds_list.append(bird_data)

    # 最終的なJSON構造を作成
    final_json_data = {'birds': birds_list}

    # JSONファイルに書き出す
    try:
        with open(JSON_FILE_PATH, 'w', encoding='utf-8') as f:
            json.dump(final_json_data, f, ensure_ascii=False, indent=4)
        print(f"成功: '{JSON_FILE_PATH}' が正常に更新されました。")
    except Exception as e:
        print(f"JSONファイルへの書き込み中にエラーが発生しました: {e}")

if __name__ == '__main__':
    create_json_from_excel()
