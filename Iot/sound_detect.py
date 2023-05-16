import displayio
bank = {"air_conditioner":"에어컨", "cars":"자동차", "car_horn":"경적", "children_playing":"아이들 소리", "dog_bark":"개 짓음", "drilling":"공사장",
        "engine_idling":"도로","gun_shot":"총소리","jackhammer":"공사장","phone":"벨소리","siren":"경고음","street_music":"노래소리"}
def sound_detect(feature):
    print(feature, "feature임")
    text = None
    picture = False
    if feature:
        feature_str = str(feature.decode())
        picture = False
        text = bank.get(feature_str)
        if text:
            file_path = f"resource/{feature_str}.bmp"
            picture = displayio.OnDiskBitmap(open(file_path, "rb"))
    return text, picture
    
