import requests
import PIL.Image
import PIL.ImageTk # type: ignore
from tkinter import *
import base64
import io
import random
def salvar_imagem():
     imgname = random.randint(0,423489)
     ler.save("C:/Users/joao/Documents/pessoal/faculdade/vagaTech/IMGTESTE/"+str(imgname)+".jpg")
    
     print("SALVO")
def atualizar_imagem():
    global ler, render, img, image_bytes
    x = requests.get('http://192.168.4.1:81/stream')
    print(x.status_code)
    if x.status_code == 200:
            print(x.text)
            
            # Decodificando a string base64 em bytes
            image_bytes = base64.b64decode(x.text)
            
            # Abrindo a imagem a partir dos bytes decodificados
            ler = PIL.Image.open(io.BytesIO(image_bytes))
            
            render = PIL.ImageTk.PhotoImage(ler)
            img  = Label(janela, image=render)
            img.image = render
            img.place(x=100, y=100)
    else:
        print('Erro! Site ou servidor não disponível.')
    janela.after(100, atualizar_imagem)
janela = Tk()
janela.title("Esp32 CAM")
janela.geometry("500x500")
frame = Frame(master=janela)
botaoSalvarFoto = Button(master=frame, text="SALVAR",command=salvar_imagem)
botaoSalvarFoto.grid(row=0, column=0)
frame.pack()
ler = None
render = None
img = None
atualizar_imagem()

janela.mainloop()