import json
import pandas as pd
from datetime import datetime

def convert_json_to_excel():
    # JSONファイルを読み込む
    try:
        with open('birds.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("エラー: 'birds.json' が見つかりません。ファイル名と場所を確認してください。")
        return
    except json.JSONDecodeError as e:
        print(f"JSONの解析中にエラーが発生しました: {e}")
        return
    
    # データを格納するリストを作成
    rows = []
    
    # 各鳥のデータを処理
    for bird in data.get('birds', []):
        # 説明文を「タイトル::本文|タイトル::本文」の形式に変換
        descriptions = []
        for desc in bird.get('descriptions', []):
            descriptions.append(f"{desc['title']}::{desc['text']}")
        descriptions_str = '|'.join(descriptions)
        
        # 詳細画像をカンマ区切りの文字列に変換
        detail_images_str = ','.join(bird.get('detailImages', []))
        
        # 行データを作成
        row = {
            'id': bird.get('id', ''),
            'nameJP': bird.get('nameJP', ''),
            'nameEN': bird.get('nameEN', ''),
            'nameSCI': bird.get('nameSCI', ''),
            'mainImage': bird.get('mainImage', ''),
            'detailImages': detail_images_str,
            'descriptions': descriptions_str
        }
        rows.append(row)
    
    # DataFrameに変換
    df = pd.DataFrame(rows)
    
    # 現在の日時をファイル名に含める
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    excel_filename = f'birds_data_{timestamp}.xlsx'
    
    # Excelファイルに保存
    try:
        df.to_excel(excel_filename, index=False, sheet_name='birds')
        print(f"成功: '{excel_filename}' が正常に作成されました。")
        print(f"以下の列が含まれています: {', '.join(df.columns)}")
    except Exception as e:
        print(f"Excelファイルの作成中にエラーが発生しました: {e}")

if __name__ == '__main__':
    convert_json_to_excel()
