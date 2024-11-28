import threading

running_task = None  #store the curr algorithm thread
running_algorithm = None  #store the curr algorithm type
stop_event = threading.Event()  #signal cancellation
