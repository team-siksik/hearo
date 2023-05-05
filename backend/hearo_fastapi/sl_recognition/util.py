import time


def time_to_string(timestamp):
    time_obj = time.localtime(timestamp)
    return time.strftime("%y%m%d%H%M%S", time_obj)
